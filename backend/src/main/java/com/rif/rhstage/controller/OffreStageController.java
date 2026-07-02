package com.rif.rhstage.controller;

import com.rif.rhstage.dto.offre.OffreStageRequest;
import com.rif.rhstage.dto.offre.OffreStageResponse;
import com.rif.rhstage.dto.offre.PatchOffreStageRequest;
import com.rif.rhstage.dto.offre.UpdateOffreStageRequest;
import com.rif.rhstage.security.AppUserDetails;
import com.rif.rhstage.service.OffreStageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/offres")
@RequiredArgsConstructor
public class OffreStageController {

    private final OffreStageService offreStageService;

    @PostMapping
    @PreAuthorize("hasRole('RH')")
    public ResponseEntity<OffreStageResponse> create(
            @AuthenticationPrincipal AppUserDetails currentUser,
            @Valid @RequestBody OffreStageRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(offreStageService.create(currentUser.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<OffreStageResponse>> getAll() {
        return ResponseEntity.ok(offreStageService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OffreStageResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(offreStageService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RH')")
    public ResponseEntity<OffreStageResponse> update(
            @PathVariable UUID id,
            @AuthenticationPrincipal AppUserDetails currentUser,
            @Valid @RequestBody UpdateOffreStageRequest request
    ) {
        return ResponseEntity.ok(offreStageService.update(id, currentUser.getId(), request));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('RH')")
    public ResponseEntity<OffreStageResponse> patch(
            @PathVariable UUID id,
            @AuthenticationPrincipal AppUserDetails currentUser,
            @RequestBody PatchOffreStageRequest request
    ) {
        return ResponseEntity.ok(offreStageService.patch(id, currentUser.getId(), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RH')")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal AppUserDetails currentUser
    ) {
        offreStageService.delete(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}

