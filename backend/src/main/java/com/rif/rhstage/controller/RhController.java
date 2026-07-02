package com.rif.rhstage.controller;

import com.rif.rhstage.dto.rh.PatchRhRequest;
import com.rif.rhstage.dto.rh.RhResponse;
import com.rif.rhstage.dto.rh.UpdateRhRequest;
import com.rif.rhstage.service.RhService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/rh")
@RequiredArgsConstructor
public class RhController {

    private final RhService rhService;

    // RH : récupérer mon profil
    @GetMapping("/profil")
    public ResponseEntity<RhResponse> getProfil(@RequestHeader("X-Rh-Id") UUID rhId) {
        return ResponseEntity.ok(rhService.getProfil(rhId));
    }

    // RH : modifier mon profil complet
    @PutMapping("/profil")
    public ResponseEntity<RhResponse> updateProfil(
            @RequestHeader("X-Rh-Id") UUID rhId,
            @Valid @RequestBody UpdateRhRequest request
    ) {
        return ResponseEntity.ok(rhService.updateProfil(rhId, request));
    }

    // RH : modifier partiellement mon profil
    @PatchMapping("/profil")
    public ResponseEntity<RhResponse> patchProfil(
            @RequestHeader("X-Rh-Id") UUID rhId,
            @Valid @RequestBody PatchRhRequest request
    ) {
        return ResponseEntity.ok(rhService.patchProfil(rhId, request));
    }
}