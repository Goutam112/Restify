# Restify
### By: Group 2635

## Models
The main models involved in Restify are detailed below. Child models that exist only
for their parent models will be discussed in the parent model.

### User
A custom `User` for authentication. `User`s are identified by a unique email, and includes
a first and last name, phone number, and an avatar image.

### Property
A `Property` is a location for `User`s to rent. It is owned by a `User`, and holds
information, such as its location and a description. It also holds
`PriceModifier`s, `PropertyImage`s, and `Amenity`s. `PriceModifier` is a 
`{month: x, price_modifier: y}` pair for monthly discounts, `PropertyImage` is an image of
the property, and `Amenity` is a string representing a feature, such as Wi-Fi, an outdoor pool,
or other such additions.

### Reservation
A `Reservation` is a booking on a property for a certain time interval. It has a `User`
which is the reserver, a `Property`, a start and end date, and a status, which includes
keywords such as "Approved" or "Pending".

### Comment
A `Comment` on a `User` or a `Property`. `Comment`s consist of a description and its `User` commenter.
There are 2 subtypes of `Comment`s: `Review` and `Reply`.

`Review`s are comments that also include a rating from 1-5. `Reply`s are comments 
(without ratings) that are attached to a `Review`.

Hosts of `Property`s may leave `Review`s on `User`s who have stayed on their property.

Similarly, `User`s who have completed a stay at a `Property` or had their reservation cancelled
may leave a `Review` on a `Property`, which can begin a `Reply` chain between the host and the guest.

### Notification
`Notification`s are informational messages delivered to the user, and are composed of their string content
and a `User` receiver. They are delivered on important events such as new `Reservation` requests.

## API Endpoints

## Accounts

### SIGN UP
#### Endpoint: 
localhost:8000/accounts/signup/
#### Description: 
Register a new `User` account. Adding an avatar is optional.
#### Methods: 
POST
#### Authentication: 
No
#### Payload: 
```json
{
    "email": "",
    "first_name": "",
    "last_name": "",
    "password": "",
    "repeat_password": "",
    "phone_number": "",
    "avatar": null
}
```

### VIEW PROFILE
#### Endpoint: 
localhost:8000/accounts/profile/view/&lt;int:user_id>/
#### Description: 
View an existing `User`'s profile. Supply the desired user's ID in the URL.
#### Methods: 
GET
#### Authentication: 
No

### EDIT PROFILE
#### Endpoint: 
localhost:8000/accounts/profile/edit/
#### Description: 
Edit a `User` account.
#### Methods: 
PUT, PATCH
#### Authentication: 
Yes
#### Payload: 
```json
{
    "first_name": "",
    "last_name": "",
    "phone_number": "",
    "avatar": null
}
```

