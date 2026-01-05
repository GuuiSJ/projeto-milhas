import 'package:dio/dio.dart';
import '../models/user_model.dart';

class AuthRepository {
  // Ajuste a URL para o endereço do seu backend Java
  final Dio _dio = Dio(BaseOptions(baseUrl: 'http://10.0.2.2:8080/api'));

  Future<void> register(UserModel user) async {
    try {
      await _dio.post('/auth/register', data: user.toJson());
    } on DioException catch (e) {
      throw Exception('Erro ao cadastrar usuário: ${e.response?.data}');
    }
  }

// Futuramente implementaremos o login aqui para receber o JWT [cite: 11]
}