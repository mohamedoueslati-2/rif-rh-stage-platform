package com.rif.rhstage.dto.candidat;

import java.time.LocalDateTime;
import java.util.UUID;

public record CandidatResponse(
        UUID id,
        String nom,
        String prenom,
        String email,
        String telephone,
        String specialite,
        String niveauEtude,
        LocalDateTime createdAt
) {
}

