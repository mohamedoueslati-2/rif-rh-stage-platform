package com.rif.rhstage.dto.demande;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record DemandeRequest(

        @NotBlank
        @URL
        @Size(max = 500)
        String cvUrl,

        @URL
        @Size(max = 500)
        String lettreMotivationUrl
) {
}

