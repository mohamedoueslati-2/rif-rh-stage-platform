package com.rif.rhstage.controller;

import com.rif.rhstage.dto.rh.CreateRhRequest;
import com.rif.rhstage.dto.rh.RhResponse;
import com.rif.rhstage.service.RhService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rh")
@RequiredArgsConstructor
public class RhController {

    private final RhService rhService;

    // Créer un compte RH
    @PostMapping
    public ResponseEntity<RhResponse> create(@Valid @RequestBody CreateRhRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rhService.create(request));
    }

    // Récupérer tous les RH
    @GetMapping
    public ResponseEntity<List<RhResponse>> getAll() {
        return ResponseEntity.ok(rhService.getAll());
    }

    // Récupérer un RH par ID
    @GetMapping("/{id}")
    public ResponseEntity<RhResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(rhService.getById(id));
    }
}

