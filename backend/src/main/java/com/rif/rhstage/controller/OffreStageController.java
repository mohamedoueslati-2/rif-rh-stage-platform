package com.rif.rhstage.controller;

import com.rif.rhstage.dto.offre.OffreStageRequest;
import com.rif.rhstage.dto.offre.OffreStageResponse;
import com.rif.rhstage.service.OffreStageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/offres")
@RequiredArgsConstructor
public class OffreStageController {

    private final OffreStageService offreStageService;

    // Créer une offre de stage par un RH
    @PostMapping
    public ResponseEntity<OffreStageResponse> create(@Valid @RequestBody OffreStageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(offreStageService.create(request));
    }

    // Récupérer toutes les offres
    @GetMapping
    public ResponseEntity<List<OffreStageResponse>> getAll() {
        return ResponseEntity.ok(offreStageService.getAll());
    }

    // Récupérer seulement les offres non expirées
    @GetMapping("/disponibles")
    public ResponseEntity<List<OffreStageResponse>> getOffresDisponibles() {
        return ResponseEntity.ok(offreStageService.getOffresDisponibles());
    }

    // Récupérer une offre par ID
    @GetMapping("/{id}")
    public ResponseEntity<OffreStageResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(offreStageService.getById(id));
    }

    // Récupérer les offres créées par un RH
    @GetMapping("/rh/{rhCreateurId}")
    public ResponseEntity<List<OffreStageResponse>> getByRhCreateurId(@PathVariable UUID rhCreateurId) {
        return ResponseEntity.ok(offreStageService.getByRhCreateurId(rhCreateurId));
    }

    // Supprimer une offre
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        offreStageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

