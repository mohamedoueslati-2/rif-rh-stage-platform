package com.rif.rhstage.dto.rh;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateRhRequest(

        @NotBlank
        String nom,

        @NotBlank
        String prenom,

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Size(min = 6)
        String motDePasse,

        String nomAffichage,

        String contactProfessionnel
) {
}

