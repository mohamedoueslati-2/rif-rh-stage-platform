package com.rif.rhstage.dto.rh;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateRhRequest(

        @NotBlank
        String nom,

        @NotBlank
        String prenom,

        @NotBlank
        @Email
        String email,

        String nomAffichage,

        String contactProfessionnel
) {
}