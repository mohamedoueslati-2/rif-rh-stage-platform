package com.rif.rhstage.config;

import com.rif.rhstage.entity.RH;
import com.rif.rhstage.repository.PersonneRepository;
import com.rif.rhstage.repository.RhRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RhRepository rhRepository;
    private final PersonneRepository personneRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.rh.email}")
    private String rhEmail;

    @Value("${app.seed.rh.password}")
    private String rhPassword;

    @Override
    @Transactional
    public void run(String... args) {
        if (personneRepository.existsByEmail(rhEmail)) {
            return;
        }

        RH rh = new RH();
        rh.setNom("Oueslati");
        rh.setPrenom("Mohamed");
        rh.setEmail(rhEmail);
        rh.setMotDePasseHash(passwordEncoder.encode(rhPassword));
        rh.setNomAffichage("RH Admin");
        rh.setContactProfessionnel(rhEmail);

        rhRepository.save(rh);
    }
}

