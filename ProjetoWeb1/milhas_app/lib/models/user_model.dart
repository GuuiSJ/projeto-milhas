class UserModel {
  final String name;
  final String email;
  final String? password;

  UserModel({required this.name, required this.email, this.password});

  // Transforma o objeto em JSON para enviar ao Spring Boot
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      'password': password,
    };
  }
}