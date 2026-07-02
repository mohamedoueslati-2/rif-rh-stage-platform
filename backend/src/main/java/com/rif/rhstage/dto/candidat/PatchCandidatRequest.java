package com.rif.rhstage.dto.candidat;

import jakarta.validation.constraints.Email;

public record PatchCandidatRequest(

        String nom,

        String prenom,

        @Email
        String email,

        String telephone,

        String specialite,

        String niveauEtude
) {
}

