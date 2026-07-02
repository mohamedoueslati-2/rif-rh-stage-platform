package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.demande.DemandeRequest;
import com.rif.rhstage.dto.demande.DemandeResponse;
import com.rif.rhstage.dto.demande.UpdateCommentaireRhRequest;
import com.rif.rhstage.dto.demande.UpdateStatutDemandeRequest;
import com.rif.rhstage.entity.*;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.DemandeMapper;
import com.rif.rhstage.repository.CandidatRepository;
import com.rif.rhstage.repository.DemandeRepository;
import com.rif.rhstage.repository.OffreStageRepository;
import com.rif.rhstage.repository.RhRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DemandeServiceImplTest {

    @Mock
    private DemandeRepository demandeRepository;

    @Mock
    private CandidatRepository candidatRepository;

    @Mock
    private OffreStageRepository offreStageRepository;

    @Mock
    private RhRepository rhRepository;

    @Mock
    private DemandeMapper demandeMapper;

    @InjectMocks
    private DemandeServiceImpl demandeService;

    @Test
    void create_shouldCreateDemande_whenDataIsValid() {
        UUID candidatId = UUID.randomUUID();
        UUID offreId = UUID.randomUUID();

        DemandeRequest request = new DemandeRequest(
                candidatId,
                offreId,
                "https://drive.google.com/cv.pdf",
                "https://drive.google.com/lettre.pdf"
        );

        Candidat candidat = new Candidat();

        OffreStage offre = new OffreStage();
        offre.setDateExpiration(LocalDate.now().plusDays(10));

        Demande demande = new Demande();
        Demande savedDemande = new Demande();

        DemandeResponse response = new DemandeResponse(
                UUID.randomUUID(),
                "DEM-2026-ABC12345",
                LocalDateTime.now(),
                request.lettreMotivationUrl(),
                request.cvUrl(),
                StatutDemande.SOUMISE,
                null,
                null,
                LocalDateTime.now(),
                candidatId,
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "Software Engineering",
                "4eme annee",
                offreId,
                "OFF-2026-001",
                "Stage Développeur Web",
                "Développement",
                null,
                null
        );

        when(demandeRepository.existsByCandidatIdAndOffreStageId(candidatId, offreId)).thenReturn(false);
        when(candidatRepository.findById(candidatId)).thenReturn(Optional.of(candidat));
        when(offreStageRepository.findById(offreId)).thenReturn(Optional.of(offre));
        when(demandeRepository.existsByReferenceDemande(anyString())).thenReturn(false);
        when(demandeMapper.toEntity(eq(request), eq(candidat), eq(offre), anyString())).thenReturn(demande);
        when(demandeRepository.save(demande)).thenReturn(savedDemande);
        when(demandeMapper.toResponse(savedDemande)).thenReturn(response);

        DemandeResponse result = demandeService.create(request);

        assertNotNull(result);
        assertEquals(StatutDemande.SOUMISE, result.statut());

        verify(demandeRepository).save(demande);
    }

    @Test
    void create_shouldThrowBadRequest_whenCandidatAlreadyApplied() {
        UUID candidatId = UUID.randomUUID();
        UUID offreId = UUID.randomUUID();

        DemandeRequest request = new DemandeRequest(
                candidatId,
                offreId,
                "https://drive.google.com/cv.pdf",
                null
        );

        when(demandeRepository.existsByCandidatIdAndOffreStageId(candidatId, offreId)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> demandeService.create(request));

        verify(demandeRepository, never()).save(any());
    }

    @Test
    void create_shouldThrowNotFound_whenCandidatDoesNotExist() {
        UUID candidatId = UUID.randomUUID();
        UUID offreId = UUID.randomUUID();

        DemandeRequest request = new DemandeRequest(
                candidatId,
                offreId,
                "https://drive.google.com/cv.pdf",
                null
        );

        when(demandeRepository.existsByCandidatIdAndOffreStageId(candidatId, offreId)).thenReturn(false);
        when(candidatRepository.findById(candidatId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> demandeService.create(request));
    }

    @Test
    void create_shouldThrowNotFound_whenOffreDoesNotExist() {
        UUID candidatId = UUID.randomUUID();
        UUID offreId = UUID.randomUUID();

        DemandeRequest request = new DemandeRequest(
                candidatId,
                offreId,
                "https://drive.google.com/cv.pdf",
                null
        );

        Candidat candidat = new Candidat();

        when(demandeRepository.existsByCandidatIdAndOffreStageId(candidatId, offreId)).thenReturn(false);
        when(candidatRepository.findById(candidatId)).thenReturn(Optional.of(candidat));
        when(offreStageRepository.findById(offreId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> demandeService.create(request));
    }

    @Test
    void create_shouldThrowBadRequest_whenOffreIsExpired() {
        UUID candidatId = UUID.randomUUID();
        UUID offreId = UUID.randomUUID();

        DemandeRequest request = new DemandeRequest(
                candidatId,
                offreId,
                "https://drive.google.com/cv.pdf",
                null
        );

        Candidat candidat = new Candidat();

        OffreStage offre = new OffreStage();
        offre.setDateExpiration(LocalDate.now().minusDays(1));

        when(demandeRepository.existsByCandidatIdAndOffreStageId(candidatId, offreId)).thenReturn(false);
        when(candidatRepository.findById(candidatId)).thenReturn(Optional.of(candidat));
        when(offreStageRepository.findById(offreId)).thenReturn(Optional.of(offre));

        assertThrows(BadRequestException.class, () -> demandeService.create(request));

        verify(demandeRepository, never()).save(any());
    }

    @Test
    void getAll_shouldReturnAllDemandes() {
        Demande demande = new Demande();

        DemandeResponse response = new DemandeResponse(
                UUID.randomUUID(),
                "DEM-2026-ABC12345",
                LocalDateTime.now(),
                null,
                "https://drive.google.com/cv.pdf",
                StatutDemande.SOUMISE,
                null,
                null,
                LocalDateTime.now(),
                UUID.randomUUID(),
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "Software Engineering",
                "4eme annee",
                UUID.randomUUID(),
                "OFF-2026-001",
                "Stage Développeur Web",
                "Développement",
                null,
                null
        );

        when(demandeRepository.findAll()).thenReturn(List.of(demande));
        when(demandeMapper.toResponse(demande)).thenReturn(response);

        List<DemandeResponse> result = demandeService.getAll();

        assertEquals(1, result.size());
    }

    @Test
    void getById_shouldThrowNotFound_whenDemandeDoesNotExist() {
        UUID id = UUID.randomUUID();

        when(demandeRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> demandeService.getById(id));
    }

    @Test
    void getByCandidatId_shouldReturnDemandes() {
        UUID candidatId = UUID.randomUUID();

        Demande demande = new Demande();

        DemandeResponse response = new DemandeResponse(
                UUID.randomUUID(),
                "DEM-2026-ABC12345",
                LocalDateTime.now(),
                null,
                "https://drive.google.com/cv.pdf",
                StatutDemande.SOUMISE,
                null,
                null,
                LocalDateTime.now(),
                candidatId,
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "Software Engineering",
                "4eme annee",
                UUID.randomUUID(),
                "OFF-2026-001",
                "Stage Développeur Web",
                "Développement",
                null,
                null
        );

        when(demandeRepository.findByCandidatId(candidatId)).thenReturn(List.of(demande));
        when(demandeMapper.toResponse(demande)).thenReturn(response);

        List<DemandeResponse> result = demandeService.getByCandidatId(candidatId);

        assertEquals(1, result.size());
        assertEquals(candidatId, result.get(0).candidatId());
    }

    @Test
    void updateStatut_shouldUpdateStatutWithRhTraitant() {
        UUID demandeId = UUID.randomUUID();
        UUID rhId = UUID.randomUUID();

        UpdateStatutDemandeRequest request = new UpdateStatutDemandeRequest(
                StatutDemande.EN_ETUDE,
                rhId
        );

        Demande demande = new Demande();
        RH rh = new RH();
        Demande savedDemande = new Demande();

        DemandeResponse response = new DemandeResponse(
                demandeId,
                "DEM-2026-ABC12345",
                LocalDateTime.now(),
                null,
                "https://drive.google.com/cv.pdf",
                StatutDemande.EN_ETUDE,
                null,
                null,
                LocalDateTime.now(),
                UUID.randomUUID(),
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "Software Engineering",
                "4eme annee",
                UUID.randomUUID(),
                "OFF-2026-001",
                "Stage Développeur Web",
                "Développement",
                rhId,
                "RH Admin"
        );

        when(demandeRepository.findById(demandeId)).thenReturn(Optional.of(demande));
        when(rhRepository.findById(rhId)).thenReturn(Optional.of(rh));
        when(demandeRepository.save(demande)).thenReturn(savedDemande);
        when(demandeMapper.toResponse(savedDemande)).thenReturn(response);

        DemandeResponse result = demandeService.updateStatut(demandeId, request);

        assertEquals(StatutDemande.EN_ETUDE, result.statut());

        verify(demandeRepository).save(demande);
    }

    @Test
    void updateCommentaire_shouldUpdateCommentaireRh() {
        UUID demandeId = UUID.randomUUID();

        UpdateCommentaireRhRequest request = new UpdateCommentaireRhRequest(
                "Profil intéressant pour test technique"
        );

        Demande demande = new Demande();
        Demande savedDemande = new Demande();

        DemandeResponse response = new DemandeResponse(
                demandeId,
                "DEM-2026-ABC12345",
                LocalDateTime.now(),
                null,
                "https://drive.google.com/cv.pdf",
                StatutDemande.EN_ETUDE,
                null,
                "Profil intéressant pour test technique",
                LocalDateTime.now(),
                UUID.randomUUID(),
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "Software Engineering",
                "4eme annee",
                UUID.randomUUID(),
                "OFF-2026-001",
                "Stage Développeur Web",
                "Développement",
                null,
                null
        );

        when(demandeRepository.findById(demandeId)).thenReturn(Optional.of(demande));
        when(demandeRepository.save(demande)).thenReturn(savedDemande);
        when(demandeMapper.toResponse(savedDemande)).thenReturn(response);

        DemandeResponse result = demandeService.updateCommentaire(demandeId, request);

        assertEquals("Profil intéressant pour test technique", result.commentaireRh());

        verify(demandeRepository).save(demande);
    }
}

