package com.rif.rhstage.controller;

import com.rif.rhstage.dto.offre.OffreStageRequest;
import com.rif.rhstage.dto.offre.OffreStageResponse;
import com.rif.rhstage.dto.offre.PatchOffreStageRequest;
import com.rif.rhstage.dto.offre.UpdateOffreStageRequest;
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

    @PostMapping
    public ResponseEntity<OffreStageResponse> create(
            @RequestHeader("X-Rh-Id") UUID rhId,
            @Valid @RequestBody OffreStageRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(offreStageService.create(rhId, request));
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
    public ResponseEntity<OffreStageResponse> update(
            @PathVariable UUID id,
            @RequestHeader("X-Rh-Id") UUID rhId,
            @Valid @RequestBody UpdateOffreStageRequest request
    ) {
        return ResponseEntity.ok(offreStageService.update(id, rhId, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<OffreStageResponse> patch(
            @PathVariable UUID id,
            @RequestHeader("X-Rh-Id") UUID rhId,
            @RequestBody PatchOffreStageRequest request
    ) {
        return ResponseEntity.ok(offreStageService.patch(id, rhId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @RequestHeader("X-Rh-Id") UUID rhId
    ) {
        offreStageService.delete(id, rhId);
        return ResponseEntity.noContent().build();
    }
}

