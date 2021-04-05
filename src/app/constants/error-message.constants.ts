export default class ErrorMessageConstants {
  static UserRoleError = 'User should be realtor or client';
  static UserExists = 'User already exits';
  static UserNotFound = 'User not found';
  static EmailExits = 'Email already in use';
  static AddApartmentByClientError = 'Client cannot add apartment';
  static ApartmentNotFound = 'Apartment not found';
  static UnAuthorisedClient = "Client can't perform this action";
  static UnAuthorisedRealtor = "Realtor can't perform this action";
  static UnAuthorisedClientOrRealtor =
    "Client or Realtor can't perform this action";
  static updateApartmentError = 'Error occured in creating apartment';
  static LogggetOutError = 'User is LoggedOut';
}
