export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'lastName',
      title: 'LastName',
      type: 'string',
    },
    {
      name: 'roomNumber',
      title: 'RoomNumber',
      type: 'number',
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string',
    },
    {
      name: 'isAdmin',
      title: 'IsAdmin',
      type: 'boolean',
    },
  ]
}