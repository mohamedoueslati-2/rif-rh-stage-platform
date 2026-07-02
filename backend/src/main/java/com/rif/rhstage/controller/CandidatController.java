package com.rif.rhstage.controller;

import com.rif.rhstage.dto.candidat.*;
import com.rif.rhstage.security.AppUserDetails;
import com.rif.rhstage.service.CandidatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<CandidatResponse> getProfil(
            @AuthenticationPrincipal AppUserDetails currentUser
    ) {
        return ResponseEntity.ok(candidatService.getProfil(currentUser.getId()));
    }

    @PutMapping("/profil")
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<CandidatResponse> updateProfil(
            @AuthenticationPrincipal AppUserDetails currentUser,
            @Valid @RequestBody UpdateCandidatRequest request
    ) {
        return ResponseEntity.ok(candidatService.updateProfil(currentUser.getId(), request));
    }

    @PatchMapping("/profil")
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<CandidatResponse> patchProfil(
            @AuthenticationPrincipal AppUserDetails currentUser,
            @Valid @RequestBody PatchCandidatRequest request
    ) {
        return ResponseEntity.ok(candidatService.patchProfil(currentUser.getId(), request));
    }

    @PutMapping("/profil/password")
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal AppUserDetails currentUser,
            @Valid @RequestBody ChangeCandidatPasswordRequest request
    ) {
        candidatService.changePassword(currentUser.getId(), request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/profil")
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<Void> deleteProfil(
            @AuthenticationPrincipal AppUserDetails currentUser
    ) {
        candidatService.deleteProfil(currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}

