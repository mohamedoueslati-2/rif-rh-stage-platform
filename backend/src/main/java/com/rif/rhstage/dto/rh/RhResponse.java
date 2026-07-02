package com.rif.rhstage.dto.rh;

import java.time.LocalDateTime;
import java.util.UUID;

public record RhResponse(
        UUID id,
        String nom,
        String prenom,
        String email,
        String nomAffichage,
        String contactProfessionnel,
        LocalDateTime createdAt
) {
}

