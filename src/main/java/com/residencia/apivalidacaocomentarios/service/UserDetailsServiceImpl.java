package com.residencia.apivalidacaocomentarios.service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if ("user".equals(username)) {
            // Role simulada: ADMIN
            return new User(
                    "user",
                    "$2a$10$wT5f9p7.C6Q2bV.M.e/L.Ox.WlM/k6.uK7D4f2n.A1D3bC5gH0Jq", // senha: "password"
                    Arrays.asList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        } else {
            throw new UsernameNotFoundException("Usuário não encontrado: " + username);
        }
    }
}
