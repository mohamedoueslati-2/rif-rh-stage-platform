package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.candidat.*;
import com.rif.rhstage.entity.Candidat;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.CandidatMapper;
import com.rif.rhstage.repository.CandidatRepository;
import com.rif.rhstage.repository.DemandeRepository;
import com.rif.rhstage.repository.PersonneRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CandidatServiceImplTest {

    @Mock
    private CandidatRepository candidatRepository;

    @Mock
    private PersonneRepository personneRepository;

    @Mock
    private DemandeRepository demandeRepository;

    @Mock
    private CandidatMapper candidatMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private CandidatServiceImpl candidatService;

    @Test
    void register_shouldCreateCandidat_whenEmailNotUsed() {
        CreateCandidatRequest request = new CreateCandidatRequest(
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "123456",
                "12345678",
                "Software Engineering",
                "4eme annee"
        );

        Candidat candidat = new Candidat();
        Candidat savedCandidat = new Candidat();

        CandidatResponse response = new CandidatResponse(
                UUID.randomUUID(),
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "12345678",
                "Software Engineering",
                "4eme annee",
                null
        );

        when(personneRepository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.motDePasse())).thenReturn("hashed-password");
        when(candidatMapper.toEntity(request, "hashed-password")).thenReturn(candidat);
        when(candidatRepository.save(candidat)).thenReturn(savedCandidat);
        when(candidatMapper.toResponse(savedCandidat)).thenReturn(response);

        CandidatResponse result = candidatService.register(request);

        assertNotNull(result);
        assertEquals("mohamed@test.com", result.email());

        verify(candidatRepository).save(candidat);
    }

    @Test
    void register_shouldThrowBadRequest_whenEmailAlreadyUsed() {
        CreateCandidatRequest request = new CreateCandidatRequest(
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "123456",
                "12345678",
                "Software Engineering",
                "4eme annee"
        );

        when(personneRepository.existsByEmail(request.email())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> candidatService.register(request));

        verify(candidatRepository, never()).save(any());
    }

    @Test
    void getProfil_shouldReturnProfile_whenCandidatExists() {
        UUID candidatId = UUID.randomUUID();
        Candidat candidat = new Candidat();

        CandidatResponse response = new CandidatResponse(
                candidatId,
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "12345678",
                "Software Engineering",
                "4eme annee",
                null
        );

        when(candidatRepository.findById(candidatId)).thenReturn(Optional.of(candidat));
        when(candidatMapper.toResponse(candidat)).thenReturn(response);

        CandidatResponse result = candidatService.getProfil(candidatId);

        assertEquals(candidatId, result.id());
        assertEquals("Mohamed", result.prenom());
    }

    @Test
    void getProfil_shouldThrowNotFound_whenCandidatDoesNotExist() {
        UUID candidatId = UUID.randomUUID();

        when(candidatRepository.findById(candidatId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> candidatService.getProfil(candidatId));
    }

    @Test
    void updateProfil_shouldUpdateFullProfile_whenEmailNotUsedByAnotherUser() {
        UUID candidatId = UUID.randomUUID();

        UpdateCandidatRequest request = new UpdateCandidatRequest(
                "Oueslati",
                "Mohamed Salah",
                "new@test.com",
                "99999999",
                "Backend",
                "4eme annee"
        );

        Candidat candidat = new Candidat();
        Candidat savedCandidat = new Candidat();

        CandidatResponse response = new CandidatResponse(
                candidatId,
                "Oueslati",
                "Mohamed Salah",
                "new@test.com",
                "99999999",
                "Backend",
                "4eme annee",
                null
        );

        when(candidatRepository.findById(candidatId)).thenReturn(Optional.of(candidat));
        when(personneRepository.existsByEmailAndIdNot(request.email(), candidatId)).thenReturn(false);
        doNothing().when(candidatMapper).updateEntity(candidat, request);
        when(candidatRepository.save(candidat)).thenReturn(savedCandidat);
        when(candidatMapper.toResponse(savedCandidat)).thenReturn(response);

        CandidatResponse result = candidatService.updateProfil(candidatId, request);

        assertEquals("new@test.com", result.email());
        assertEquals("Mohamed Salah", result.prenom());

        verify(candidatMapper).updateEntity(candidat, request);
        verify(candidatRepository).save(candidat);
    }

    @Test
    void updateProfil_shouldThrowBadRequest_whenEmailUsedByAnotherUser() {
        UUID candidatId = UUID.randomUUID();

        UpdateCandidatRequest request = new UpdateCandidatRequest(
                "Oueslati",
                "Mohamed",
                "used@test.com",
                "99999999",
                "Backend",
                "4eme annee"
        );

        Candidat candidat = new Candidat();

        when(candidatRepository.findById(candidatId)).thenReturn(Optional.of(candidat));
        when(personneRepository.existsByEmailAndIdNot(request.email(), candidatId)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> candidatService.updateProfil(candidatId, request));

        verify(candidatRepository, never()).save(any());
    }

    @Test
    void patchProfil_shouldPatchProfile_whenValidData() {
        UUID candidatId = UUID.randomUUID();

        PatchCandidatRequest request = new PatchCandidatRequest(
                null,
                "Mohamed Aziz",
                null,
                null,
                "Fullstack",
                null
        );

        Candidat candidat = new Candidat();
        Candidat savedCandidat = new Candidat();

        CandidatResponse response = new CandidatResponse(
                candidatId,
                "Oueslati",
                "Mohamed Aziz",
                "mohamed@test.com",
                "12345678",
                "Fullstack",
                "4eme annee",
                null
        );

        when(candidatRepository.findById(candidatId)).thenReturn(Optional.of(candidat));
        doNothing().when(candidatMapper).patchEntity(candidat, request);
        when(candidatRepository.save(candidat)).thenReturn(savedCandidat);
        when(candidatMapper.toResponse(savedCandidat)).thenReturn(response);

        CandidatResponse result = candidatService.patchProfil(candidatId, request);

        assertEquals("Mohamed Aziz", result.prenom());
        assertEquals("Fullstack", result.specialite());

        verify(candidatMapper).patchEntity(candidat, request);
        verify(candidatRepository).save(candidat);
    }

    @Test
    void patchProfil_shouldThrowBadRequest_whenEmailUsedByAnotherUser() {
        UUID candidatId = UUID.randomUUID();

        PatchCandidatRequest request = new PatchCandidatRequest(
                null,
                null,
                "used@test.com",
                null,
                null,
                null
        );

        Candidat candidat = new Candidat();

        when(candidatRepository.findById(candidatId)).thenReturn(Optional.of(candidat));
        when(personneRepository.existsByEmailAndIdNot(request.email(), candidatId)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> candidatService.patchProfil(candidatId, request));

        verify(candidatRepository, never()).save(any());
    }

    @Test
    void changePassword_shouldChangePassword_whenOldPasswordIsCorrect() {
        UUID candidatId = UUID.randomUUID();

        ChangeCandidatPasswordRequest request = new ChangeCandidatPasswordRequest(
                "oldPassword",
                "newPassword"
        );

        Candidat candidat = new Candidat();
        candidat.setMotDePasseHash("old-hashed-password");

        when(candidatRepository.findById(candidatId)).thenReturn(Optional.of(candidat));
        when(passwordEncoder.matches(request.oldPassword(), candidat.getMotDePasseHash())).thenReturn(true);
        when(passwordEncoder.encode(request.newPassword())).thenReturn("new-hashed-password");

        candidatService.changePassword(candidatId, request);

        assertEquals("new-hashed-password", candidat.getMotDePasseHash());

        verify(candidatRepository).save(candidat);
    }

    @Test
    void changePassword_shouldThrowBadRequest_whenOldPasswordIsWrong() {
        UUID candidatId = UUID.randomUUID();

        ChangeCandidatPasswordRequest request = new ChangeCandidatPasswordRequest(
                "wrongPassword",
                "newPassword"
        );

        Candidat candidat = new Candidat();
        candidat.setMotDePasseHash("old-hashed-password");

        when(candidatRepository.findById(candidatId)).thenReturn(Optional.of(candidat));
        when(passwordEncoder.matches(request.oldPassword(), candidat.getMotDePasseHash())).thenReturn(false);

        assertThrows(BadRequestException.class, () -> candidatService.changePassword(candidatId, request));

        verify(candidatRepository, never()).save(any());
    }

    @Test
    void deleteProfil_shouldDeleteCandidat_whenCandidatHasNoDemandes() {
        UUID candidatId = UUID.randomUUID();

        Candidat candidat = new Candidat();

        when(candidatRepository.findById(candidatId)).thenReturn(Optional.of(candidat));
        when(demandeRepository.existsByCandidatId(candidatId)).thenReturn(false);

        candidatService.deleteProfil(candidatId);

        verify(candidatRepository).delete(candidat);
    }

    @Test
    void deleteProfil_shouldThrowBadRequest_whenCandidatHasDemandes() {
        UUID candidatId = UUID.randomUUID();

        Candidat candidat = new Candidat();

        when(candidatRepository.findById(candidatId)).thenReturn(Optional.of(candidat));
        when(demandeRepository.existsByCandidatId(candidatId)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> candidatService.deleteProfil(candidatId));

        verify(candidatRepository, never()).delete(any());
    }
}
