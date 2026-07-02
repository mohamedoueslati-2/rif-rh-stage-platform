package com.rif.rhstage.controller;

import com.rif.rhstage.dto.demande.DemandeRequest;
import com.rif.rhstage.dto.demande.DemandeResponse;
import com.rif.rhstage.dto.demande.UpdateCommentaireRhRequest;
import com.rif.rhstage.dto.demande.UpdateNoteTestRequest;
import com.rif.rhstage.dto.demande.UpdateStatutDemandeRequest;
import com.rif.rhstage.service.DemandeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/demandes")
@RequiredArgsConstructor
public class DemandeController {

    private final DemandeService demandeService;

    // Candidat : déposer une demande pour une offre
    @PostMapping("/offre/{offreId}")
    public ResponseEntity<DemandeResponse> create(
            @RequestHeader("X-Candidat-Id") UUID candidatId,
            @PathVariable UUID offreId,
            @Valid @RequestBody DemandeRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(demandeService.create(candidatId, offreId, request));
    }

    // Candidat : voir mes demandes
    @GetMapping("/me")
    public ResponseEntity<List<DemandeResponse>> getMyDemandes(
            @RequestHeader("X-Candidat-Id") UUID candidatId
    ) {
        return ResponseEntity.ok(demandeService.getMyDemandes(candidatId));
    }

    // Candidat : voir le détail de ma demande
    @GetMapping("/me/{id}")
    public ResponseEntity<DemandeResponse> getMyDemandeById(
            @RequestHeader("X-Candidat-Id") UUID candidatId,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(demandeService.getMyDemandeById(candidatId, id));
    }

    // RH : voir toutes les demandes
    @GetMapping
    public ResponseEntity<List<DemandeResponse>> getAll() {
        return ResponseEntity.ok(demandeService.getAll());
    }

    // RH : voir détail d'une demande
    @GetMapping("/{id}")
    public ResponseEntity<DemandeResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(demandeService.getById(id));
    }

    // RH : changer le statut d'une demande
    @PatchMapping("/{id}/statut")
    public ResponseEntity<DemandeResponse> updateStatut(
            @RequestHeader("X-Rh-Id") UUID rhId,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStatutDemandeRequest request
    ) {
        return ResponseEntity.ok(demandeService.updateStatut(id, rhId, request));
    }

    // RH : ajouter un commentaire RH
    @PatchMapping("/{id}/commentaire")
    public ResponseEntity<DemandeResponse> updateCommentaire(
            @RequestHeader("X-Rh-Id") UUID rhId,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCommentaireRhRequest request
    ) {
        return ResponseEntity.ok(demandeService.updateCommentaire(id, rhId, request));
    }

    // RH : ajouter la note du test technique
    @PatchMapping("/{id}/note-test")
    public ResponseEntity<DemandeResponse> updateNoteTest(
            @RequestHeader("X-Rh-Id") UUID rhId,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateNoteTestRequest request
    ) {
        return ResponseEntity.ok(demandeService.updateNoteTest(id, rhId, request));
    }

    // Candidat : annuler sa demande
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader("X-Candidat-Id") UUID candidatId,
            @PathVariable UUID id
    ) {
        demandeService.delete(id, candidatId);
        return ResponseEntity.noContent().build();
    }
}

