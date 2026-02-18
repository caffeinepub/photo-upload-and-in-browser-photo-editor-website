import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  type ImageEditMetadata = {
    imageName : Text;
    editTimestamp : Int;
    editingSettings : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userEdits = Map.empty<Principal, List.List<ImageEditMetadata>>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveEditMetadata(imageName : Text, editingSettings : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save edits");
    };

    let metadata : ImageEditMetadata = {
      imageName;
      editTimestamp = Time.now();
      editingSettings;
    };

    switch (userEdits.get(caller)) {
      case (null) {
        let newList = List.repeat<ImageEditMetadata>(metadata, 1);
        userEdits.add(caller, newList);
      };
      case (?existingEdits) {
        existingEdits.add(metadata);
        userEdits.add(caller, existingEdits);
      };
    };
  };

  public query ({ caller }) func getRecentEdits() : async [ImageEditMetadata] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view edits");
    };

    switch (userEdits.get(caller)) {
      case (null) { [] };
      case (?editList) {
        editList.values().toArray();
      };
    };
  };

  public query ({ caller }) func getUserEdits(user : Principal) : async [ImageEditMetadata] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own edits");
    };

    switch (userEdits.get(user)) {
      case (null) { [] };
      case (?editList) {
        editList.values().toArray();
      };
    };
  };
};
