package com.rif.rhstage.dto.candidat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangeCandidatPasswordRequest(

        @NotBlank
        String oldPassword,

        @NotBlank
        @Size(min = 6)
        String newPassword
) {
}

