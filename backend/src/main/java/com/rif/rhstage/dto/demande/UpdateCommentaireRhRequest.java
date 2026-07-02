package com.rif.rhstage.dto.demande;

import jakarta.validation.constraints.NotBlank;

public record UpdateCommentaireRhRequest(

        @NotBlank
        String commentaireRh
) {
}

