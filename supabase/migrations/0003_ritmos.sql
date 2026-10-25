-- Escala de ritmo: Chill / Moderado / Intenso → Tranqui / Intermedio / Fuerte.
-- "Varía" y "No sé todavía" no cambian.
update public.leads set ritmo = case
    when ritmo like 'Chill%' then 'Tranqui · menos de 25 km/h'
    when ritmo like 'Moderado%' then 'Intermedio · 25 a 30 km/h'
    when ritmo like 'Intenso%' then 'Fuerte · más de 30 km/h'
    else ritmo end
  where ritmo like 'Chill%' or ritmo like 'Moderado%' or ritmo like 'Intenso%';

update public.leads set grupo_ritmo = case
    when grupo_ritmo like 'Chill%' then 'Tranqui · menos de 25 km/h'
    when grupo_ritmo like 'Moderado%' then 'Intermedio · 25 a 30 km/h'
    when grupo_ritmo like 'Intenso%' then 'Fuerte · más de 30 km/h'
    else grupo_ritmo end
  where grupo_ritmo like 'Chill%' or grupo_ritmo like 'Moderado%' or grupo_ritmo like 'Intenso%';
