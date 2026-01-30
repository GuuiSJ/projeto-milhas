package com.milhas.dto.flag;

import jakarta.validation.constraints.NotBlank;

public record FlagDTO(

        Long id,
        @NotBlank(message = "O nome de bandeira é obrigatório")
        String nome

) {

}