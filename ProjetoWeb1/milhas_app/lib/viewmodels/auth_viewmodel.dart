import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../repositories/auth_repository.dart';

class AuthViewModel extends ChangeNotifier {
  final AuthRepository _repository = AuthRepository();
  bool isLoading = false;

  Future<bool> register(String name, String email, String password) async {
    isLoading = true;
    notifyListeners();

    try {
      final user = UserModel(name: name, email: email, password: password);
      await _repository.register(user);
      isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      isLoading = false;
      notifyListeners();
      return false;
    }
  }
}