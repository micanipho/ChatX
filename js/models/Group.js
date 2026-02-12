export class Group {
  constructor(id, name, members, admin, createdAt, avatar = null) {
    this.id = id;
    this.name = name;
    this.members = members; 
    this.admin = admin; 
    this.createdAt = createdAt;
    this.avatar = avatar;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      members: this.members,
      admin: this.admin,
      createdAt: this.createdAt,
      avatar: this.avatar,
    };
  }
}