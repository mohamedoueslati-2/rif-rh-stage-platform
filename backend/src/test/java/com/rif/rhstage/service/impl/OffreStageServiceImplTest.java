package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.offre.OffreStageRequest;
import com.rif.rhstage.dto.offre.OffreStageResponse;
import com.rif.rhstage.dto.offre.PatchOffreStageRequest;
import com.rif.rhstage.dto.offre.UpdateOffreStageRequest;
import com.rif.rhstage.entity.OffreStage;
import com.rif.rhstage.entity.RH;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.OffreStageMapper;
import com.rif.rhstage.repository.DemandeRepository;
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
    private DemandeRepository demandeRepository;

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
                LocalDate.now().plusMonths(1),
                LocalDate.now().plusDays(5)
        );

        RH rh = new RH();
        rh.setId(rhId);

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

        OffreStageResponse result = offreStageService.create(rhId, request);

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
                LocalDate.now().plusMonths(1)
        );

        when(offreStageRepository.existsByReferenceOffre(request.referenceOffre())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> offreStageService.create(rhId, request));

        verify(offreStageRepository, never()).save(any());
    }

    @Test
    void create_shouldThrowBadRequest_whenExpirationAfterStartDate() {
        UUID rhId = UUID.randomUUID();

        OffreStageRequest request = new OffreStageRequest(
                "OFF-2026-001",
                "Stage Développeur Web",
                "Description",
                "Développement",
                "Tunis",
                "2 mois",
                LocalDate.now().plusDays(5),
                LocalDate.now().plusMonths(1)
        );

        when(offreStageRepository.existsByReferenceOffre(request.referenceOffre())).thenReturn(false);

        assertThrows(BadRequestException.class, () -> offreStageService.create(rhId, request));

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
                LocalDate.now().plusMonths(1),
                LocalDate.now().plusDays(5)
        );

        when(offreStageRepository.existsByReferenceOffre(request.referenceOffre())).thenReturn(false);
        when(rhRepository.findById(rhId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> offreStageService.create(rhId, request));

        verify(offreStageRepository, never()).save(any());
    }

    @Test
    void getAll_shouldReturnAvailableOffres() {
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

        when(offreStageRepository.findByDateExpirationGreaterThanEqual(any(LocalDate.class)))
                .thenReturn(List.of(offre));
        when(offreStageMapper.toResponse(offre)).thenReturn(response);

        List<OffreStageResponse> result = offreStageService.getAll();

        assertEquals(1, result.size());
        assertEquals("OFF-2026-001", result.get(0).referenceOffre());
    }

    @Test
    void getById_shouldReturnOffre_whenExists() {
        UUID offreId = UUID.randomUUID();

        OffreStage offre = new OffreStage();

        OffreStageResponse response = new OffreStageResponse(
                offreId,
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

        when(offreStageRepository.findById(offreId)).thenReturn(Optional.of(offre));
        when(offreStageMapper.toResponse(offre)).thenReturn(response);

        OffreStageResponse result = offreStageService.getById(offreId);

        assertEquals(offreId, result.id());
    }

    @Test
    void getById_shouldThrowNotFound_whenOffreDoesNotExist() {
        UUID offreId = UUID.randomUUID();

        when(offreStageRepository.findById(offreId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> offreStageService.getById(offreId));
    }

    @Test
    void update_shouldUpdateOffre_whenDataIsValidAndRhIsOwner() {
        UUID offreId = UUID.randomUUID();
        UUID rhId = UUID.randomUUID();

        UpdateOffreStageRequest request = new UpdateOffreStageRequest(
                "OFF-2026-002",
                "Stage Backend",
                "Spring Boot PostgreSQL",
                "Backend",
                "Tunis",
                "2 mois",
                LocalDate.now().plusMonths(1),
                LocalDate.now().plusDays(5)
        );

        RH rh = new RH();
        rh.setId(rhId);

        OffreStage offre = new OffreStage();
        offre.setRhCreateur(rh);

        OffreStage savedOffre = new OffreStage();

        OffreStageResponse response = new OffreStageResponse(
                offreId,
                "OFF-2026-002",
                "Stage Backend",
                "Spring Boot PostgreSQL",
                "Backend",
                "Tunis",
                "2 mois",
                request.dateDebut(),
                request.dateExpiration(),
                null,
                rhId,
                "RH Admin",
                "rh@test.com"
        );

        when(offreStageRepository.findById(offreId)).thenReturn(Optional.of(offre));
        when(offreStageRepository.existsByReferenceOffreAndIdNot(request.referenceOffre(), offreId)).thenReturn(false);
        doNothing().when(offreStageMapper).updateEntity(offre, request);
        when(offreStageRepository.save(offre)).thenReturn(savedOffre);
        when(offreStageMapper.toResponse(savedOffre)).thenReturn(response);

        OffreStageResponse result = offreStageService.update(offreId, rhId, request);

        assertEquals("OFF-2026-002", result.referenceOffre());
        assertEquals("Stage Backend", result.titre());

        verify(offreStageMapper).updateEntity(offre, request);
        verify(offreStageRepository).save(offre);
    }

    @Test
    void update_shouldThrowBadRequest_whenRhIsNotOwner() {
        UUID offreId = UUID.randomUUID();
        UUID ownerRhId = UUID.randomUUID();
        UUID otherRhId = UUID.randomUUID();

        UpdateOffreStageRequest request = new UpdateOffreStageRequest(
                "OFF-2026-002",
                "Stage Backend",
                "Spring Boot PostgreSQL",
                "Backend",
                "Tunis",
                "2 mois",
                LocalDate.now().plusDays(5),
                LocalDate.now().plusMonths(1)
        );

        RH ownerRh = new RH();
        ownerRh.setId(ownerRhId);

        OffreStage offre = new OffreStage();
        offre.setRhCreateur(ownerRh);

        when(offreStageRepository.findById(offreId)).thenReturn(Optional.of(offre));

        assertThrows(BadRequestException.class, () -> offreStageService.update(offreId, otherRhId, request));

        verify(offreStageRepository, never()).save(any());
    }

    @Test
    void update_shouldThrowBadRequest_whenReferenceAlreadyUsed() {
        UUID offreId = UUID.randomUUID();
        UUID rhId = UUID.randomUUID();

        UpdateOffreStageRequest request = new UpdateOffreStageRequest(
                "OFF-2026-002",
                "Stage Backend",
                "Spring Boot PostgreSQL",
                "Backend",
                "Tunis",
                "2 mois",
                LocalDate.now().plusDays(5),
                LocalDate.now().plusMonths(1)
        );

        RH rh = new RH();
        rh.setId(rhId);

        OffreStage offre = new OffreStage();
        offre.setRhCreateur(rh);

        when(offreStageRepository.findById(offreId)).thenReturn(Optional.of(offre));
        when(offreStageRepository.existsByReferenceOffreAndIdNot(request.referenceOffre(), offreId)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> offreStageService.update(offreId, rhId, request));

        verify(offreStageRepository, never()).save(any());
    }

    @Test
    void patch_shouldPatchOffre_whenDataIsValidAndRhIsOwner() {
        UUID offreId = UUID.randomUUID();
        UUID rhId = UUID.randomUUID();

        PatchOffreStageRequest request = new PatchOffreStageRequest(
                null,
                "Stage Fullstack Updated",
                null,
                "Fullstack",
                null,
                null,
                null,
                null
        );

        RH rh = new RH();
        rh.setId(rhId);

        OffreStage offre = new OffreStage();
        offre.setReferenceOffre("OFF-2026-001");
        offre.setDateDebut(LocalDate.now().plusMonths(1));
        offre.setDateExpiration(LocalDate.now().plusDays(5));
        offre.setRhCreateur(rh);

        OffreStage savedOffre = new OffreStage();

        OffreStageResponse response = new OffreStageResponse(
                offreId,
                "OFF-2026-001",
                "Stage Fullstack Updated",
                "Description",
                "Fullstack",
                "Tunis",
                "2 mois",
                offre.getDateDebut(),
                offre.getDateExpiration(),
                null,
                rhId,
                "RH Admin",
                "rh@test.com"
        );

        when(offreStageRepository.findById(offreId)).thenReturn(Optional.of(offre));
        doNothing().when(offreStageMapper).patchEntity(offre, request);
        when(offreStageRepository.save(offre)).thenReturn(savedOffre);
        when(offreStageMapper.toResponse(savedOffre)).thenReturn(response);

        OffreStageResponse result = offreStageService.patch(offreId, rhId, request);

        assertEquals("Stage Fullstack Updated", result.titre());
        assertEquals("Fullstack", result.domaine());

        verify(offreStageMapper).patchEntity(offre, request);
        verify(offreStageRepository).save(offre);
    }

    @Test
    void patch_shouldThrowBadRequest_whenReferenceAlreadyUsed() {
        UUID offreId = UUID.randomUUID();
        UUID rhId = UUID.randomUUID();

        PatchOffreStageRequest request = new PatchOffreStageRequest(
                "OFF-2026-999",
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );

        RH rh = new RH();
        rh.setId(rhId);

        OffreStage offre = new OffreStage();
        offre.setReferenceOffre("OFF-2026-001");
        offre.setDateDebut(LocalDate.now().plusMonths(1));
        offre.setDateExpiration(LocalDate.now().plusDays(5));
        offre.setRhCreateur(rh);

        when(offreStageRepository.findById(offreId)).thenReturn(Optional.of(offre));
        when(offreStageRepository.existsByReferenceOffreAndIdNot(request.referenceOffre(), offreId)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> offreStageService.patch(offreId, rhId, request));

        verify(offreStageRepository, never()).save(any());
    }

    @Test
    void patch_shouldThrowBadRequest_whenExpirationAfterStartDate() {
        UUID offreId = UUID.randomUUID();
        UUID rhId = UUID.randomUUID();

        PatchOffreStageRequest request = new PatchOffreStageRequest(
                null,
                null,
                null,
                null,
                null,
                null,
                LocalDate.now().plusDays(5),
                LocalDate.now().plusMonths(1)
        );

        RH rh = new RH();
        rh.setId(rhId);

        OffreStage offre = new OffreStage();
        offre.setReferenceOffre("OFF-2026-001");
        offre.setDateDebut(LocalDate.now().plusMonths(1));
        offre.setDateExpiration(LocalDate.now().plusDays(5));
        offre.setRhCreateur(rh);

        when(offreStageRepository.findById(offreId)).thenReturn(Optional.of(offre));

        assertThrows(BadRequestException.class, () -> offreStageService.patch(offreId, rhId, request));

        verify(offreStageRepository, never()).save(any());
    }

    @Test
    void delete_shouldDeleteOffre_whenRhIsOwnerAndOffreHasNoDemandes() {
        UUID offreId = UUID.randomUUID();
        UUID rhId = UUID.randomUUID();

        RH rh = new RH();
        rh.setId(rhId);

        OffreStage offre = new OffreStage();
        offre.setRhCreateur(rh);

        when(offreStageRepository.findById(offreId)).thenReturn(Optional.of(offre));
        when(demandeRepository.existsByOffreStageId(offreId)).thenReturn(false);

        offreStageService.delete(offreId, rhId);

        verify(offreStageRepository).delete(offre);
    }

    @Test
    void delete_shouldThrowBadRequest_whenOffreHasDemandes() {
        UUID offreId = UUID.randomUUID();
        UUID rhId = UUID.randomUUID();

        RH rh = new RH();
        rh.setId(rhId);

        OffreStage offre = new OffreStage();
        offre.setRhCreateur(rh);

        when(offreStageRepository.findById(offreId)).thenReturn(Optional.of(offre));
        when(demandeRepository.existsByOffreStageId(offreId)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> offreStageService.delete(offreId, rhId));

        verify(offreStageRepository, never()).delete(any());
    }

    @Test
    void delete_shouldThrowBadRequest_whenRhIsNotOwner() {
        UUID offreId = UUID.randomUUID();
        UUID ownerRhId = UUID.randomUUID();
        UUID otherRhId = UUID.randomUUID();

        RH ownerRh = new RH();
        ownerRh.setId(ownerRhId);

        OffreStage offre = new OffreStage();
        offre.setRhCreateur(ownerRh);

        when(offreStageRepository.findById(offreId)).thenReturn(Optional.of(offre));

        assertThrows(BadRequestException.class, () -> offreStageService.delete(offreId, otherRhId));

        verify(offreStageRepository, never()).delete(any());
    }
}
