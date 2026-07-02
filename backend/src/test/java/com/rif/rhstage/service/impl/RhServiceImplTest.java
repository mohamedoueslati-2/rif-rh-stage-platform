package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.rh.PatchRhRequest;
import com.rif.rhstage.dto.rh.RhResponse;
import com.rif.rhstage.dto.rh.UpdateRhRequest;
import com.rif.rhstage.entity.RH;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.RhMapper;
import com.rif.rhstage.repository.PersonneRepository;
import com.rif.rhstage.repository.RhRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RhServiceImplTest {

    @Mock
    private RhRepository rhRepository;

    @Mock
    private PersonneRepository personneRepository;

    @Mock
    private RhMapper rhMapper;

    @InjectMocks
    private RhServiceImpl rhService;

    @Test
    void getProfil_shouldReturnRhProfile_whenRhExists() {
        UUID rhId = UUID.randomUUID();

        RH rh = new RH();

        RhResponse response = new RhResponse(
                rhId,
                "RH",
                "Admin",
                "rh@test.com",
                "RH RIF",
                "contact@rif.com",
                null
        );

        when(rhRepository.findById(rhId)).thenReturn(Optional.of(rh));
        when(rhMapper.toResponse(rh)).thenReturn(response);

        RhResponse result = rhService.getProfil(rhId);

        assertEquals(rhId, result.id());
        assertEquals("rh@test.com", result.email());
    }

    @Test
    void getProfil_shouldThrowNotFound_whenRhDoesNotExist() {
        UUID rhId = UUID.randomUUID();

        when(rhRepository.findById(rhId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> rhService.getProfil(rhId));
    }

    @Test
    void updateProfil_shouldUpdateFullProfile_whenEmailNotUsedByAnotherUser() {
        UUID rhId = UUID.randomUUID();

        UpdateRhRequest request = new UpdateRhRequest(
                "RH",
                "Manager",
                "new-rh@test.com",
                "Manager RH",
                "manager@rif.com"
        );

        RH rh = new RH();
        RH savedRh = new RH();

        RhResponse response = new RhResponse(
                rhId,
                "RH",
                "Manager",
                "new-rh@test.com",
                "Manager RH",
                "manager@rif.com",
                null
        );

        when(rhRepository.findById(rhId)).thenReturn(Optional.of(rh));
        when(personneRepository.existsByEmailAndIdNot(request.email(), rhId)).thenReturn(false);
        doNothing().when(rhMapper).updateEntity(rh, request);
        when(rhRepository.save(rh)).thenReturn(savedRh);
        when(rhMapper.toResponse(savedRh)).thenReturn(response);

        RhResponse result = rhService.updateProfil(rhId, request);

        assertEquals("new-rh@test.com", result.email());
        assertEquals("Manager", result.prenom());

        verify(rhMapper).updateEntity(rh, request);
        verify(rhRepository).save(rh);
    }

    @Test
    void updateProfil_shouldThrowBadRequest_whenEmailUsedByAnotherUser() {
        UUID rhId = UUID.randomUUID();

        UpdateRhRequest request = new UpdateRhRequest(
                "RH",
                "Admin",
                "used@test.com",
                "RH RIF",
                "contact@rif.com"
        );

        RH rh = new RH();

        when(rhRepository.findById(rhId)).thenReturn(Optional.of(rh));
        when(personneRepository.existsByEmailAndIdNot(request.email(), rhId)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> rhService.updateProfil(rhId, request));

        verify(rhRepository, never()).save(any());
    }

    @Test
    void patchProfil_shouldPatchProfile_whenValidData() {
        UUID rhId = UUID.randomUUID();

        PatchRhRequest request = new PatchRhRequest(
                null,
                "Admin Updated",
                null,
                "RH Updated",
                null
        );

        RH rh = new RH();
        RH savedRh = new RH();

        RhResponse response = new RhResponse(
                rhId,
                "RH",
                "Admin Updated",
                "rh@test.com",
                "RH Updated",
                "contact@rif.com",
                null
        );

        when(rhRepository.findById(rhId)).thenReturn(Optional.of(rh));
        doNothing().when(rhMapper).patchEntity(rh, request);
        when(rhRepository.save(rh)).thenReturn(savedRh);
        when(rhMapper.toResponse(savedRh)).thenReturn(response);

        RhResponse result = rhService.patchProfil(rhId, request);

        assertEquals("Admin Updated", result.prenom());
        assertEquals("RH Updated", result.nomAffichage());

        verify(rhMapper).patchEntity(rh, request);
        verify(rhRepository).save(rh);
    }

    @Test
    void patchProfil_shouldThrowBadRequest_whenEmailUsedByAnotherUser() {
        UUID rhId = UUID.randomUUID();

        PatchRhRequest request = new PatchRhRequest(
                null,
                null,
                "used@test.com",
                null,
                null
        );

        RH rh = new RH();

        when(rhRepository.findById(rhId)).thenReturn(Optional.of(rh));
        when(personneRepository.existsByEmailAndIdNot(request.email(), rhId)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> rhService.patchProfil(rhId, request));

        verify(rhRepository, never()).save(any());
    }
}