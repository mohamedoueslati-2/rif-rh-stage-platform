package com.rif.rhstage.controller;

import com.rif.rhstage.dto.demande.DemandeRequest;
import com.rif.rhstage.dto.demande.DemandeResponse;
import com.rif.rhstage.dto.demande.UpdateCommentaireRhRequest;
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

    // Déposer une demande de stage par un candidat
    @PostMapping
    public ResponseEntity<DemandeResponse> create(@Valid @RequestBody DemandeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(demandeService.create(request));
    }

    // Récupérer toutes les demandes
    @GetMapping
    public ResponseEntity<List<DemandeResponse>> getAll() {
        return ResponseEntity.ok(demandeService.getAll());
    }

    // Récupérer une demande par ID
    @GetMapping("/{id}")
    public ResponseEntity<DemandeResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(demandeService.getById(id));
    }

    // Récupérer les demandes d'un candidat
    @GetMapping("/candidat/{candidatId}")
    public ResponseEntity<List<DemandeResponse>> getByCandidatId(@PathVariable UUID candidatId) {
        return ResponseEntity.ok(demandeService.getByCandidatId(candidatId));
    }

    // Récupérer les demandes reçues par une offre
    @GetMapping("/offre/{offreStageId}")
    public ResponseEntity<List<DemandeResponse>> getByOffreStageId(@PathVariable UUID offreStageId) {
        return ResponseEntity.ok(demandeService.getByOffreStageId(offreStageId));
    }

    // Modifier le statut d'une demande par le RH
    @PatchMapping("/{id}/statut")
    public ResponseEntity<DemandeResponse> updateStatut(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStatutDemandeRequest request
    ) {
        return ResponseEntity.ok(demandeService.updateStatut(id, request));
    }

    // Modifier le commentaire RH d'une demande
    @PatchMapping("/{id}/commentaire")
    public ResponseEntity<DemandeResponse> updateCommentaire(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCommentaireRhRequest request
    ) {
        return ResponseEntity.ok(demandeService.updateCommentaire(id, request));
    }
}

