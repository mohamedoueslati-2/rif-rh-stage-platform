package com.rif.rhstage.dto.demande;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

import java.util.UUID;

public record DemandeRequest(

        @NotNull
        UUID candidatId,

        @NotNull
        UUID offreStageId,

        @NotBlank
        @URL
        @Size(max = 500)
        String cvUrl,

        @URL
        @Size(max = 500)
        String lettreMotivationUrl
) {
}

