package com.rif.rhstage.controller;

import com.rif.rhstage.dto.candidat.*;
import com.rif.rhstage.service.CandidatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/candidats")
@RequiredArgsConstructor
public class CandidatController {

    private final CandidatService candidatService;

    @PostMapping("/register")
    public ResponseEntity<CandidatResponse> register(@Valid @RequestBody CreateCandidatRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(candidatService.register(request));
    }

    @GetMapping("/profil")
    public ResponseEntity<CandidatResponse> getProfil(@RequestHeader("X-Candidat-Id") UUID candidatId) {
        return ResponseEntity.ok(candidatService.getProfil(candidatId));
    }

    @PutMapping("/profil")
    public ResponseEntity<CandidatResponse> updateProfil(
            @RequestHeader("X-Candidat-Id") UUID candidatId,
            @Valid @RequestBody UpdateCandidatRequest request
    ) {
        return ResponseEntity.ok(candidatService.updateProfil(candidatId, request));
    }

    @PatchMapping("/profil")
    public ResponseEntity<CandidatResponse> patchProfil(
            @RequestHeader("X-Candidat-Id") UUID candidatId,
            @Valid @RequestBody PatchCandidatRequest request
    ) {
        return ResponseEntity.ok(candidatService.patchProfil(candidatId, request));
    }

    @PutMapping("/profil/password")
    public ResponseEntity<Void> changePassword(
            @RequestHeader("X-Candidat-Id") UUID candidatId,
            @Valid @RequestBody ChangeCandidatPasswordRequest request
    ) {
        candidatService.changePassword(candidatId, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/profil")
    public ResponseEntity<Void> deleteProfil(@RequestHeader("X-Candidat-Id") UUID candidatId) {
        candidatService.deleteProfil(candidatId);
        return ResponseEntity.noContent().build();
    }
}

