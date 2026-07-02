package com.rif.rhstage.controller;

import com.rif.rhstage.dto.demande.DemandeRequest;
import com.rif.rhstage.dto.demande.DemandeResponse;
import com.rif.rhstage.dto.demande.UpdateCommentaireRhRequest;
import com.rif.rhstage.dto.demande.UpdateNoteTestRequest;
import com.rif.rhstage.dto.demande.UpdateStatutDemandeRequest;
import com.rif.rhstage.security.AppUserDetails;
import com.rif.rhstage.service.DemandeService;
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
@RequestMapping("/api/demandes")
@RequiredArgsConstructor
public class DemandeController {

    private final DemandeService demandeService;

    @PostMapping("/offre/{offreId}")
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<DemandeResponse> create(
            @AuthenticationPrincipal AppUserDetails currentUser,
            @PathVariable UUID offreId,
            @Valid @RequestBody DemandeRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(demandeService.create(currentUser.getId(), offreId, request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<List<DemandeResponse>> getMyDemandes(
            @AuthenticationPrincipal AppUserDetails currentUser
    ) {
        return ResponseEntity.ok(demandeService.getMyDemandes(currentUser.getId()));
    }

    @GetMapping("/me/{id}")
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<DemandeResponse> getMyDemandeById(
            @AuthenticationPrincipal AppUserDetails currentUser,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(demandeService.getMyDemandeById(currentUser.getId(), id));
    }

    @GetMapping
    @PreAuthorize("hasRole('RH')")
    public ResponseEntity<List<DemandeResponse>> getAll() {
        return ResponseEntity.ok(demandeService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('RH')")
    public ResponseEntity<DemandeResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(demandeService.getById(id));
    }

    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasRole('RH')")
    public ResponseEntity<DemandeResponse> updateStatut(
            @AuthenticationPrincipal AppUserDetails currentUser,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStatutDemandeRequest request
    ) {
        return ResponseEntity.ok(demandeService.updateStatut(id, currentUser.getId(), request));
    }

    @PatchMapping("/{id}/commentaire")
    @PreAuthorize("hasRole('RH')")
    public ResponseEntity<DemandeResponse> updateCommentaire(
            @AuthenticationPrincipal AppUserDetails currentUser,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCommentaireRhRequest request
    ) {
        return ResponseEntity.ok(demandeService.updateCommentaire(id, currentUser.getId(), request));
    }

    @PatchMapping("/{id}/note-test")
    @PreAuthorize("hasRole('RH')")
    public ResponseEntity<DemandeResponse> updateNoteTest(
            @AuthenticationPrincipal AppUserDetails currentUser,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateNoteTestRequest request
    ) {
        return ResponseEntity.ok(demandeService.updateNoteTest(id, currentUser.getId(), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal AppUserDetails currentUser,
            @PathVariable UUID id
    ) {
        demandeService.delete(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}

