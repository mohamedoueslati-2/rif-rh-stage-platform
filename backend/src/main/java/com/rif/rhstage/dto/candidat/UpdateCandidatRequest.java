package com.rif.rhstage.dto.candidat;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateCandidatRequest(

        @NotBlank
        String nom,

        @NotBlank
        String prenom,

        @NotBlank
        @Email
        String email,

        String telephone,

        String specialite,

        String niveauEtude
) {
}

