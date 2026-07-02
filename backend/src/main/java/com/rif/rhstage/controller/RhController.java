package com.rif.rhstage.controller;

import com.rif.rhstage.dto.rh.PatchRhRequest;
import com.rif.rhstage.dto.rh.RhResponse;
import com.rif.rhstage.dto.rh.UpdateRhRequest;
import com.rif.rhstage.security.AppUserDetails;
import com.rif.rhstage.service.RhService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rh")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RH')")
public class RhController {

    private final RhService rhService;

    @GetMapping("/profil")
    public ResponseEntity<RhResponse> getProfil(
            @AuthenticationPrincipal AppUserDetails currentUser
    ) {
        return ResponseEntity.ok(rhService.getProfil(currentUser.getId()));
    }

    @PutMapping("/profil")
    public ResponseEntity<RhResponse> updateProfil(
            @AuthenticationPrincipal AppUserDetails currentUser,
            @Valid @RequestBody UpdateRhRequest request
    ) {
        return ResponseEntity.ok(rhService.updateProfil(currentUser.getId(), request));
    }

    @PatchMapping("/profil")
    public ResponseEntity<RhResponse> patchProfil(
            @AuthenticationPrincipal AppUserDetails currentUser,
            @Valid @RequestBody PatchRhRequest request
    ) {
        return ResponseEntity.ok(rhService.patchProfil(currentUser.getId(), request));
    }
}