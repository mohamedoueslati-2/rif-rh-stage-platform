package com.rif.rhstage.repository;

import com.rif.rhstage.entity.Personne;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PersonneRepository extends JpaRepository<Personne, UUID> {

    Optional<Personne> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, UUID id);
}

