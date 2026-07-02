package com.rif.rhstage.dto.rh;

import jakarta.validation.constraints.Email;

public record PatchRhRequest(

        String nom,

        String prenom,

        @Email
        String email,

        String nomAffichage,

        String contactProfessionnel
) {
}