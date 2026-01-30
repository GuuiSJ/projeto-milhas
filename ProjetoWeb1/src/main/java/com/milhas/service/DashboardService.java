package com.milhas.service;

import com.milhas.dto.dashboard.DashboardResponseDTO;

public interface DashboardService {

    DashboardResponseDTO getDashboardData(String username);
}
