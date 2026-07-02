package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.offre.OffreStageRequest;
import com.rif.rhstage.dto.offre.OffreStageResponse;
import com.rif.rhstage.entity.OffreStage;
import com.rif.rhstage.entity.RH;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.OffreStageMapper;
import com.rif.rhstage.repository.OffreStageRepository;
import com.rif.rhstage.repository.RhRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OffreStageServiceImplTest {

    @Mock
    private OffreStageRepository offreStageRepository;

    @Mock
    private RhRepository rhRepository;

    @Mock
    private OffreStageMapper offreStageMapper;

    @InjectMocks
    private OffreStageServiceImpl offreStageService;

    @Test
    void create_shouldCreateOffre_whenDataIsValid() {
        UUID rhId = UUID.randomUUID();

        OffreStageRequest request = new OffreStageRequest(
                "OFF-2026-001",
                "Stage Développeur Web",
                "Développement Spring Boot Angular",
                "Développement",
                "Tunis",
                "2 mois",
                LocalDate.now().plusDays(5),
                LocalDate.now().plusMonths(1),
                rhId
        );

        RH rh = new RH();
        OffreStage offre = new OffreStage();
        OffreStage savedOffre = new OffreStage();

        OffreStageResponse response = new OffreStageResponse(
                UUID.randomUUID(),
                "OFF-2026-001",
                "Stage Développeur Web",
                "Développement Spring Boot Angular",
                "Développement",
                "Tunis",
                "2 mois",
                request.dateDebut(),
                request.dateExpiration(),
                null,
                rhId,
                "RH Admin",
                "rh@test.com"
        );

        when(offreStageRepository.existsByReferenceOffre(request.referenceOffre())).thenReturn(false);
        when(rhRepository.findById(rhId)).thenReturn(Optional.of(rh));
        when(offreStageMapper.toEntity(request, rh)).thenReturn(offre);
        when(offreStageRepository.save(offre)).thenReturn(savedOffre);
        when(offreStageMapper.toResponse(savedOffre)).thenReturn(response);

        OffreStageResponse result = offreStageService.create(request);

        assertNotNull(result);
        assertEquals("OFF-2026-001", result.referenceOffre());

        verify(offreStageRepository).save(offre);
    }

    @Test
    void create_shouldThrowBadRequest_whenReferenceAlreadyExists() {
        UUID rhId = UUID.randomUUID();

        OffreStageRequest request = new OffreStageRequest(
                "OFF-2026-001",
                "Stage Développeur Web",
                "Description",
                "Développement",
                "Tunis",
                "2 mois",
                LocalDate.now().plusDays(5),
                LocalDate.now().plusMonths(1),
                rhId
        );

        when(offreStageRepository.existsByReferenceOffre(request.referenceOffre())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> offreStageService.create(request));

        verify(offreStageRepository, never()).save(any());
    }

    @Test
    void create_shouldThrowBadRequest_whenExpirationBeforeStartDate() {
        UUID rhId = UUID.randomUUID();

        OffreStageRequest request = new OffreStageRequest(
                "OFF-2026-001",
                "Stage Développeur Web",
                "Description",
                "Développement",
                "Tunis",
                "2 mois",
                LocalDate.now().plusMonths(1),
                LocalDate.now().plusDays(5),
                rhId
        );

        when(offreStageRepository.existsByReferenceOffre(request.referenceOffre())).thenReturn(false);

        assertThrows(BadRequestException.class, () -> offreStageService.create(request));

        verify(offreStageRepository, never()).save(any());
    }

    @Test
    void create_shouldThrowNotFound_whenRhDoesNotExist() {
        UUID rhId = UUID.randomUUID();

        OffreStageRequest request = new OffreStageRequest(
                "OFF-2026-001",
                "Stage Développeur Web",
                "Description",
                "Développement",
                "Tunis",
                "2 mois",
                LocalDate.now().plusDays(5),
                LocalDate.now().plusMonths(1),
                rhId
        );

        when(offreStageRepository.existsByReferenceOffre(request.referenceOffre())).thenReturn(false);
        when(rhRepository.findById(rhId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> offreStageService.create(request));
    }

    @Test
    void getAll_shouldReturnAllOffres() {
        OffreStage offre = new OffreStage();

        OffreStageResponse response = new OffreStageResponse(
                UUID.randomUUID(),
                "OFF-2026-001",
                "Stage Développeur Web",
                "Description",
                "Développement",
                "Tunis",
                "2 mois",
                LocalDate.now(),
                LocalDate.now().plusMonths(1),
                null,
                UUID.randomUUID(),
                "RH Admin",
                "rh@test.com"
        );

        when(offreStageRepository.findAll()).thenReturn(List.of(offre));
        when(offreStageMapper.toResponse(offre)).thenReturn(response);

        List<OffreStageResponse> result = offreStageService.getAll();

        assertEquals(1, result.size());
    }

    @Test
    void getById_shouldThrowNotFound_whenOffreDoesNotExist() {
        UUID id = UUID.randomUUID();

        when(offreStageRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> offreStageService.getById(id));
    }

    @Test
    void delete_shouldDeleteOffre_whenExists() {
        UUID id = UUID.randomUUID();

        when(offreStageRepository.existsById(id)).thenReturn(true);

        offreStageService.delete(id);

        verify(offreStageRepository).deleteById(id);
    }

    @Test
    void delete_shouldThrowNotFound_whenOffreDoesNotExist() {
        UUID id = UUID.randomUUID();

        when(offreStageRepository.existsById(id)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> offreStageService.delete(id));

        verify(offreStageRepository, never()).deleteById(any());
    }
}

