create or replace function get_latitude_longitude(location geography)
returns double precision[] as $$
begin
  return array[
    ST_Y(location::geometry),
    ST_X(location::geometry)
  ];
end;
$$ language plpgsql;
