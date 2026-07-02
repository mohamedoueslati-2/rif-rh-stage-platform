package com.rif.rhstage.dto.auth;

import java.util.UUID;

public record LoginResponse(
        String token,
        String tokenType,
        UUID userId,
        String email,
        String role
) {
}

