package com.rif.rhstage.controller;

import com.rif.rhstage.dto.candidat.CandidatResponse;
import com.rif.rhstage.dto.candidat.CreateCandidatRequest;
import com.rif.rhstage.service.CandidatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/candidats")
@RequiredArgsConstructor
public class CandidatController {

    private final CandidatService candidatService;

    // Créer un compte candidat
    @PostMapping
    public ResponseEntity<CandidatResponse> create(@Valid @RequestBody CreateCandidatRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(candidatService.create(request));
    }

    // Récupérer tous les candidats
    @GetMapping
    public ResponseEntity<List<CandidatResponse>> getAll() {
        return ResponseEntity.ok(candidatService.getAll());
    }

    // Récupérer un candidat par ID
    @GetMapping("/{id}")
    public ResponseEntity<CandidatResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(candidatService.getById(id));
    }
}

