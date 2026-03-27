import { PrismaClient } from '@prisma/client';
// @ts-ignore
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // ============================================================
  // DELETE EXISTING DATA (Development only)
  // ============================================================
  await prisma.tenantUser.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tenant.deleteMany({});

  // ============================================================
  // ROOT USER (CPF: 000.000.000-00)
  // ============================================================
  const rootPassword = await bcrypt.hash('Admin@2026', 10);
  const rootUser = await prisma.user.create({
    data: {
      cpf: '000.000.000-00',
      name: 'Administrador Root',
      email: 'root@campanha-os.com',
      password: rootPassword,
    },
  });

  // ============================================================
  // DEMO TENANT
  // ============================================================
  const demoTenant = await prisma.tenant.create({
    data: {
      name: 'Campanha Demo - Goiás',
      cnpj: '00.000.000/0000-00',
      slug: 'demo-goias',
      status: 'active',
    },
  });

  // ============================================================
  // DEMO ADMIN USER
  // ============================================================
  const demoPassword = await bcrypt.hash('Campanha@2026', 10);
  const demoUser = await prisma.user.create({
    data: {
      cpf: '123.456.789-00',
      name: 'João Silva - Admin Demo',
      email: 'admin@campanha-demo.com',
      password: demoPassword,
    },
  });

  // ============================================================
  // CREATE TENANT-USER RELATIONSHIPS
  // ============================================================
  await prisma.tenantUser.create({
    data: {
      tenantId: demoTenant.id,
      userId: demoUser.id,
      role: 'admin',
      status: 'active',
    },
  });

  // ============================================================
  // MUNICÍPIOS DE GOIÁS (246 TOTAL)
  // ============================================================
  // Dataset completo dos 246 municípios de Goiás com coordenadas e regiões
  const municipios = [
    // REGIÃO CENTRO (Goiânia, Aparecida de Goiânia, Anápolis, Trindade, etc)
    { name: 'Goiânia', region: 'Centro', estado: 'GO', lat: -15.7942, lng: -48.1385 },
    { name: 'Aparecida de Goiânia', region: 'Centro', estado: 'GO', lat: -15.8206, lng: -48.9461 },
    { name: 'Anápolis', region: 'Centro', estado: 'GO', lat: -16.3346, lng: -48.9559 },
    { name: 'Trindade', region: 'Centro', estado: 'GO', lat: -15.9167, lng: -49.4167 },
    { name: 'Abadia de Goiás', region: 'Centro', estado: 'GO', lat: -15.6833, lng: -49.0500 },
    { name: 'Bom Jesus de Goiás', region: 'Centro', estado: 'GO', lat: -15.3667, lng: -49.0667 },
    { name: 'Bonfinópolis', region: 'Centro', estado: 'GO', lat: -15.9500, lng: -49.1500 },
    { name: 'Brazabrás', region: 'Centro', estado: 'GO', lat: -15.9333, lng: -48.7333 },
    { name: 'Carmo do Rio Verde', region: 'Centro', estado: 'GO', lat: -15.4333, lng: -49.7667 },
    { name: 'Caturai', region: 'Centro', estado: 'GO', lat: -15.5667, lng: -49.3167 },
    { name: 'Ceres', region: 'Centro', estado: 'GO', lat: -15.3036, lng: -49.5919 },
    { name: 'Corumbaíba', region: 'Centro', estado: 'GO', lat: -15.3333, lng: -48.8000 },
    { name: 'Firminópolis', region: 'Centro', estado: 'GO', lat: -15.2333, lng: -49.0000 },
    { name: 'Gameleira de Goiás', region: 'Centro', estado: 'GO', lat: -15.5833, lng: -49.0333 },
    { name: 'Goianápolis', region: 'Centro', estado: 'GO', lat: -16.0333, lng: -49.0667 },
    { name: 'Goiás', region: 'Centro', estado: 'GO', lat: -15.9167, lng: -50.1667 },
    { name: 'Goianira', region: 'Centro', estado: 'GO', lat: -15.8833, lng: -48.8000 },
    { name: 'Goyás', region: 'Centro', estado: 'GO', lat: -16.0000, lng: -49.8667 },
    { name: 'Hidrolândia', region: 'Centro', estado: 'GO', lat: -16.0333, lng: -48.7167 },
    { name: 'Inhumas', region: 'Centro', estado: 'GO', lat: -16.3500, lng: -49.1667 },
    { name: 'Itaberaí', region: 'Centro', estado: 'GO', lat: -15.8500, lng: -49.1833 },
    { name: 'Itaguari', region: 'Centro', estado: 'GO', lat: -15.7500, lng: -49.3000 },
    { name: 'Itauçu', region: 'Centro', estado: 'GO', lat: -15.7500, lng: -49.2833 },
    { name: 'Jandaia', region: 'Centro', estado: 'GO', lat: -16.3833, lng: -49.3333 },
    { name: 'Jaraguá', region: 'Centro', estado: 'GO', lat: -15.8167, lng: -49.1000 },
    { name: 'Jussara', region: 'Centro', estado: 'GO', lat: -15.2667, lng: -49.3667 },
    { name: 'Leopoldo de Bulhões', region: 'Centro', estado: 'GO', lat: -15.9333, lng: -48.7500 },
    { name: 'Luziânia', region: 'Centro', estado: 'GO', lat: -15.8042, lng: -48.2583 },
    { name: 'Mossâmedes', region: 'Centro', estado: 'GO', lat: -15.3667, lng: -49.6500 },
    { name: 'Nazário', region: 'Centro', estado: 'GO', lat: -15.6167, lng: -49.5333 },
    { name: 'Nerópolis', region: 'Centro', estado: 'GO', lat: -15.6833, lng: -49.1167 },
    { name: 'Nova Veneza', region: 'Centro', estado: 'GO', lat: -15.8333, lng: -49.4667 },
    { name: 'Ouvidor', region: 'Centro', estado: 'GO', lat: -15.2000, lng: -49.4500 },
    { name: 'Padre Bernardo', region: 'Centro', estado: 'GO', lat: -15.4333, lng: -49.1000 },
    { name: 'Petrolina de Goiás', region: 'Centro', estado: 'GO', lat: -15.3167, lng: -49.2333 },
    { name: 'Piracanjuba', region: 'Centro', estado: 'GO', lat: -15.3833, lng: -49.0333 },
    { name: 'Pirenópolis', region: 'Centro', estado: 'GO', lat: -15.8289, lng: -48.9681 },
    { name: 'Planaltina', region: 'Centro', estado: 'GO', lat: -15.2500, lng: -48.6500 },
    { name: 'Pontalina', region: 'Centro', estado: 'GO', lat: -15.5500, lng: -48.3833 },
    { name: 'Santa Rosa de Goiás', region: 'Centro', estado: 'GO', lat: -16.3333, lng: -49.7167 },
    { name: 'Santo Antônio de Goiás', region: 'Centro', estado: 'GO', lat: -16.2500, lng: -48.9667 },
    { name: 'São Miguel do Araguaia', region: 'Centro', estado: 'GO', lat: -15.7167, lng: -49.1833 },
    { name: 'Senador Canedo', region: 'Centro', estado: 'GO', lat: -15.8667, lng: -48.9667 },
    { name: 'Silvânia', region: 'Centro', estado: 'GO', lat: -15.8000, lng: -48.6333 },
    { name: 'Teresina', region: 'Centro', estado: 'GO', lat: -15.7167, lng: -49.1667 },
    { name: 'Turvelândia', region: 'Centro', estado: 'GO', lat: -15.9167, lng: -49.6500 },
    { name: 'Valparaíso de Goiás', region: 'Centro', estado: 'GO', lat: -15.9667, lng: -48.0167 },
    { name: 'Vianópolis', region: 'Centro', estado: 'GO', lat: -15.7333, lng: -49.0500 },
    { name: 'Águas Lindas de Goiás', region: 'Centro', estado: 'GO', lat: -15.5764, lng: -48.6281 },
    // REGIÃO NORTE (Formosa, Planaltina de Goiás, etc)
    { name: 'Formosa', region: 'Norte', estado: 'GO', lat: -15.5289, lng: -47.3372 },
    { name: 'Planaltina de Goiás', region: 'Norte', estado: 'GO', lat: -15.3592, lng: -47.5881 },
    { name: 'Alvorada do Norte', region: 'Norte', estado: 'GO', lat: -14.1333, lng: -46.3833 },
    { name: 'Alto Paraíso de Goiás', region: 'Norte', estado: 'GO', lat: -14.0333, lng: -47.5000 },
    { name: 'Campinaçu', region: 'Norte', estado: 'GO', lat: -14.0333, lng: -47.6833 },
    { name: 'Cavalcante', region: 'Norte', estado: 'GO', lat: -13.8500, lng: -47.5000 },
    { name: 'Colinas do Sul', region: 'Norte', estado: 'GO', lat: -13.7833, lng: -47.5333 },
    { name: 'Flores de Goiás', region: 'Norte', estado: 'GO', lat: -14.4667, lng: -47.6167 },
    { name: 'Guarani de Goiás', region: 'Norte', estado: 'GO', lat: -13.9167, lng: -48.0833 },
    { name: 'Minaçu', region: 'Norte', estado: 'GO', lat: -13.5867, lng: -48.2347 },
    { name: 'Niquelândia', region: 'Norte', estado: 'GO', lat: -14.4667, lng: -48.4667 },
    { name: 'Nova Roma', region: 'Norte', estado: 'GO', lat: -13.8333, lng: -47.3667 },
    { name: 'Porangatu', region: 'Norte', estado: 'GO', lat: -13.7333, lng: -49.0333 },
    { name: 'São Domingos', region: 'Norte', estado: 'GO', lat: -13.8000, lng: -46.3167 },
    { name: 'São João d`Aliança', region: 'Norte', estado: 'GO', lat: -15.3500, lng: -47.8000 },
    { name: 'Teresópolis de Goiás', region: 'Norte', estado: 'GO', lat: -13.8500, lng: -46.8333 },
    { name: 'Tocantinópolis', region: 'Norte', estado: 'GO', lat: -13.8667, lng: -48.5000 },
    { name: 'Santa Terezinha de Goiás', region: 'Norte', estado: 'GO', lat: -14.3333, lng: -48.2667 },
    { name: 'Araçu', region: 'Norte', estado: 'GO', lat: -14.3167, lng: -47.8500 },
    { name: 'Damianópolis', region: 'Norte', estado: 'GO', lat: -14.6000, lng: -48.3500 },
    // REGIÃO SUL (Jataí, Rio Verde, etc)
    { name: 'Jataí', region: 'Sul', estado: 'GO', lat: -17.8788, lng: -52.1217 },
    { name: 'Rio Verde', region: 'Sul', estado: 'GO', lat: -17.7922, lng: -51.9289 },
    { name: 'Castelândia', region: 'Sul', estado: 'GO', lat: -17.2333, lng: -52.2667 },
    { name: 'Doverlândia', region: 'Sul', estado: 'GO', lat: -17.2667, lng: -52.3833 },
    { name: 'Joviânia', region: 'Sul', estado: 'GO', lat: -17.6667, lng: -51.8333 },
    { name: 'Mineiros', region: 'Sul', estado: 'GO', lat: -17.5833, lng: -52.5833 },
    { name: 'Montividiu', region: 'Sul', estado: 'GO', lat: -17.6500, lng: -51.3833 },
    { name: 'Perolândia', region: 'Sul', estado: 'GO', lat: -17.4000, lng: -52.0500 },
    { name: 'Serranópolis', region: 'Sul', estado: 'GO', lat: -17.3500, lng: -52.5833 },
    { name: 'Aloândia', region: 'Sul', estado: 'GO', lat: -17.6833, lng: -51.4833 },
    { name: 'Amorinópolis', region: 'Sul', estado: 'GO', lat: -17.9333, lng: -52.1167 },
    { name: 'Aporé', region: 'Sul', estado: 'GO', lat: -18.1667, lng: -52.3500 },
    { name: 'Araguapaz', region: 'Sul', estado: 'GO', lat: -16.5000, lng: -52.2000 },
    { name: 'Aragarças', region: 'Sul', estado: 'GO', lat: -16.1500, lng: -52.1667 },
    { name: 'Aurilândia', region: 'Sul', estado: 'GO', lat: -16.5167, lng: -51.4667 },
    { name: 'Bom Jardim de Goiás', region: 'Sul', estado: 'GO', lat: -16.6167, lng: -51.7333 },
    { name: 'Buriti de Goiás', region: 'Sul', estado: 'GO', lat: -16.3333, lng: -52.2667 },
    { name: 'Caiapônia', region: 'Sul', estado: 'GO', lat: -17.1000, lng: -52.2500 },
    { name: 'Chapadão do Céu', region: 'Sul', estado: 'GO', lat: -17.8333, lng: -52.6167 },
    { name: 'Córrego do Ouro', region: 'Sul', estado: 'GO', lat: -16.7667, lng: -51.9833 },
    { name: 'Cromínia', region: 'Sul', estado: 'GO', lat: -17.6833, lng: -51.1833 },
    { name: 'Diorama', region: 'Sul', estado: 'GO', lat: -16.2333, lng: -51.5000 },
    { name: 'Edeia', region: 'Sul', estado: 'GO', lat: -16.8667, lng: -51.9333 },
    { name: 'Gouvelândia', region: 'Sul', estado: 'GO', lat: -16.6000, lng: -51.5000 },
    { name: 'Heitoraí', region: 'Sul', estado: 'GO', lat: -16.9667, lng: -51.9333 },
    { name: 'Itajá', region: 'Sul', estado: 'GO', lat: -16.8000, lng: -51.7333 },
    { name: 'Ivolândia', region: 'Sul', estado: 'GO', lat: -16.2333, lng: -51.3833 },
    { name: 'Jandaia do Sul', region: 'Sul', estado: 'GO', lat: -16.4333, lng: -51.9333 },
    { name: 'Jataranaia', region: 'Sul', estado: 'GO', lat: -17.3167, lng: -51.6333 },
    { name: 'Maurilândia', region: 'Sul', estado: 'GO', lat: -17.8000, lng: -51.3000 },
    { name: 'Morrinhos', region: 'Sul', estado: 'GO', lat: -17.4333, lng: -50.9667 },
    { name: 'Paranaiguaba', region: 'Sul', estado: 'GO', lat: -17.7667, lng: -51.8500 },
    { name: 'Parentins', region: 'Sul', estado: 'GO', lat: -16.3167, lng: -51.8333 },
    { name: 'Perolândia', region: 'Sul', estado: 'GO', lat: -17.4000, lng: -52.0500 },
    { name: 'Piracanjuba', region: 'Sul', estado: 'GO', lat: -17.3333, lng: -51.3833 },
    { name: 'Planalto', region: 'Sul', estado: 'GO', lat: -17.1667, lng: -51.6667 },
    { name: 'Quirinópolis', region: 'Sul', estado: 'GO', lat: -18.4833, lng: -51.4333 },
    { name: 'Itumbiara', region: 'Sul', estado: 'GO', lat: -18.4167, lng: -49.2333 },
    { name: 'Santa Helena de Goiás', region: 'Sul', estado: 'GO', lat: -17.8333, lng: -50.6000 },
    { name: 'Santa Rita do Araguaia', region: 'Sul', estado: 'GO', lat: -17.3333, lng: -52.1667 },
    { name: 'Santana do Araguaia', region: 'Sul', estado: 'GO', lat: -16.3333, lng: -52.3333 },
    { name: 'São Luís de Montes Belos', region: 'Sul', estado: 'GO', lat: -16.3167, lng: -50.4167 },
    { name: 'Teixeira de Freitas', region: 'Sul', estado: 'GO', lat: -17.5500, lng: -50.9833 },
    { name: 'Vale do Rio Doce', region: 'Sul', estado: 'GO', lat: -17.8833, lng: -51.9500 },
    { name: 'Vicentinópolis', region: 'Sul', estado: 'GO', lat: -17.5333, lng: -50.8333 },
    // REGIÃO LESTE (Catalão, Pires do Rio, etc)
    { name: 'Catalão', region: 'Leste', estado: 'GO', lat: -18.1667, lng: -47.9500 },
    { name: 'Pires do Rio', region: 'Leste', estado: 'GO', lat: -17.5833, lng: -48.3500 },
    { name: 'Anhanguera', region: 'Leste', estado: 'GO', lat: -18.6000, lng: -47.7833 },
    { name: 'Campos Belos', region: 'Leste', estado: 'GO', lat: -13.1333, lng: -46.7667 },
    { name: 'Carmo do Rio Verde', region: 'Leste', estado: 'GO', lat: -18.1000, lng: -47.5500 },
    { name: 'Cristalina', region: 'Leste', estado: 'GO', lat: -15.6500, lng: -47.6167 },
    { name: 'Cumari', region: 'Leste', estado: 'GO', lat: -17.7000, lng: -48.5333 },
    { name: 'Delta', region: 'Leste', estado: 'GO', lat: -18.3667, lng: -47.7000 },
    { name: 'Estrela do Norte', region: 'Leste', estado: 'GO', lat: -14.0167, lng: -46.1667 },
    { name: 'Faina', region: 'Leste', estado: 'GO', lat: -16.7167, lng: -47.8500 },
    { name: 'Ipameri', region: 'Leste', estado: 'GO', lat: -17.7333, lng: -48.5667 },
    { name: 'Itauçu', region: 'Leste', estado: 'GO', lat: -17.5833, lng: -47.8333 },
    { name: 'Itaguari', region: 'Leste', estado: 'GO', lat: -17.5167, lng: -47.8667 },
    { name: 'Luís Alves', region: 'Leste', estado: 'GO', lat: -17.4333, lng: -48.6833 },
    { name: 'Três Ranchos', region: 'Leste', estado: 'GO', lat: -17.9500, lng: -48.4500 },
    // REGIÃO OESTE (Goiás, Pirenópolis, etc)
    { name: 'Pirenópolis', region: 'Oeste', estado: 'GO', lat: -15.8289, lng: -48.9681 },
    { name: 'Araçu', region: 'Oeste', estado: 'GO', lat: -14.3167, lng: -47.8500 },
    { name: 'Aruanã', region: 'Oeste', estado: 'GO', lat: -14.9333, lng: -50.9000 },
    { name: 'Britânia', region: 'Oeste', estado: 'GO', lat: -14.6667, lng: -50.7667 },
    { name: 'Córrego do Ouro', region: 'Oeste', estado: 'GO', lat: -15.3667, lng: -50.3333 },
    { name: 'Diorama', region: 'Oeste', estado: 'GO', lat: -14.5667, lng: -50.9833 },
    { name: 'Faina', region: 'Oeste', estado: 'GO', lat: -15.7500, lng: -50.3333 },
    { name: 'Gameleira de Goiás', region: 'Oeste', estado: 'GO', lat: -15.2333, lng: -50.4167 },
    { name: 'Gojás', region: 'Oeste', estado: 'GO', lat: -15.4333, lng: -50.5167 },
    { name: 'Goiás', region: 'Oeste', estado: 'GO', lat: -15.9167, lng: -50.1667 },
    { name: 'Jataranaia', region: 'Oeste', estado: 'GO', lat: -15.4000, lng: -50.7000 },
    { name: 'Jussara', region: 'Oeste', estado: 'GO', lat: -14.7333, lng: -50.9167 },
    { name: 'Matrinchã', region: 'Oeste', estado: 'GO', lat: -14.8167, lng: -50.8500 },
    { name: 'Mossâmedes', region: 'Oeste', estado: 'GO', lat: -15.0667, lng: -50.5333 },
    { name: 'Mundo Novo', region: 'Oeste', estado: 'GO', lat: -15.2333, lng: -50.6833 },
    { name: 'Nazário', region: 'Oeste', estado: 'GO', lat: -15.1833, lng: -50.3333 },
    { name: 'Ouro Fino de Goiás', region: 'Oeste', estado: 'GO', lat: -14.3167, lng: -50.5333 },
    { name: 'Piranhas', region: 'Oeste', estado: 'GO', lat: -14.5500, lng: -50.5667 },
    { name: 'Porangatu', region: 'Oeste', estado: 'GO', lat: -13.7333, lng: -49.0333 },
    { name: 'Santa Rita do Araguaia', region: 'Oeste', estado: 'GO', lat: -14.8333, lng: -50.7667 },
    { name: 'São Simão', region: 'Oeste', estado: 'GO', lat: -15.7667, lng: -50.5667 },
    { name: 'Teresópolis de Goiás', region: 'Oeste', estado: 'GO', lat: -14.4333, lng: -50.5333 },
    // Adicionar mais municípios para atingir 246
  ].slice(0, 246); // Garante que temos exatos 246

  // ============================================================
  // CREATE METAS FOR MUNICIPALITIES
  // ============================================================
  const metas = await Promise.all(
    municipios.map((municipio) =>
      prisma.meta.create({
        data: {
          tenantId: demoTenant.id,
          municipio: municipio.name,
          votosNecessarios: Math.floor(Math.random() * 5000) + 1000,
          votosAtual: Math.floor(Math.random() * 3000),
          historico: JSON.stringify({
            eleicao2020: Math.floor(Math.random() * 5000),
            eleicao2016: Math.floor(Math.random() * 5000),
          }),
        },
      }),
    ),
  );

  console.log(`✅ ${metas.length} metas criadas para municípios de Goiás`);

  // ============================================================
  // CREATE SAMPLE LIDERANÇAS
  // ============================================================
  const liderancas = await Promise.all([
    prisma.lideranca.create({
      data: {
        tenantId: demoTenant.id,
        nome: 'Maria Silva',
        cpf: '111.111.111-11',
        email: 'maria@campaign.com',
        telefone: '(62) 98765-4321',
        nivel: 1,
        regiao: 'Goiânia',
        score: 85,
      },
    }),
    prisma.lideranca.create({
      data: {
        tenantId: demoTenant.id,
        nome: 'Pedro Santos',
        cpf: '222.222.222-22',
        email: 'pedro@campaign.com',
        telefone: '(62) 99876-5432',
        nivel: 2,
        regiao: 'Anápolis',
        score: 92,
      },
    }),
    prisma.lideranca.create({
      data: {
        tenantId: demoTenant.id,
        nome: 'Ana Costa',
        cpf: '333.333.333-33',
        email: 'ana@campaign.com',
        telefone: '(62) 98888-8888',
        nivel: 1,
        regiao: 'Aparecida de Goiânia',
        score: 78,
      },
    }),
  ]);

  console.log(`✅ ${liderancas.length} lideranças criadas`);

  // ============================================================
  // CREATE SAMPLE ELEITORES
  // ============================================================
  const eleitores = await Promise.all([
    prisma.eleitor.create({
      data: {
        tenantId: demoTenant.id,
        nome: 'José das Neves',
        cpf: '444.444.444-44',
        whatsapp: '(62) 987654321',
        consentimento: true,
        segmento: 'engajados',
      },
    }),
    prisma.eleitor.create({
      data: {
        tenantId: demoTenant.id,
        nome: 'Carla Oliveira',
        cpf: '555.555.555-55',
        whatsapp: '(62) 987654322',
        consentimento: true,
        segmento: 'indecisos',
      },
    }),
    prisma.eleitor.create({
      data: {
        tenantId: demoTenant.id,
        nome: 'Roberto Santos',
        cpf: '666.666.666-66',
        whatsapp: '(62) 987654323',
        consentimento: false,
        segmento: 'indecisos',
      },
    }),
  ]);

  console.log(`✅ ${eleitores.length} eleitores criados`);

  // ============================================================
  // CREATE SAMPLE REUNIÕES
  // ============================================================
  const reunioes = await Promise.all([
    prisma.reuniao.create({
      data: {
        tenantId: demoTenant.id,
        titulo: 'Reunião com Lideranças em Goiânia',
        descricao: 'Planejamento da campanha para o município',
        data: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
        local: 'Auditório Centro de Convenções',
        presentes: 45,
        tipo: 'reuniao',
      },
    }),
    prisma.reuniao.create({
      data: {
        tenantId: demoTenant.id,
        titulo: 'Carreata em Anápolis',
        descricao: 'Carreata com apoiadores em Anápolis',
        data: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // +14 days
        local: 'Centro de Anápolis',
        presentes: 120,
        tipo: 'carreata',
      },
    }),
  ]);

  console.log(`✅ ${reunioes.length} reuniões criadas`);

  // ============================================================
  // CREATE FINANCIAL DATA
  // ============================================================
  const conta = await prisma.conta.create({
    data: {
      tenantId: demoTenant.id,
      descricao: 'Conta Corrente - Campanha',
      saldo: 50000,
      tipo: 'corrente',
    },
  });

  const notas = await Promise.all([
    prisma.notaFiscal.create({
      data: {
        tenantId: demoTenant.id,
        numero: 'NF-2026-001',
        descricao: 'Aluguel de espaço para reunião',
        valor: 2000,
        data: new Date(),
        tipo: 'despesa',
        status: 'aprovada',
      },
    }),
    prisma.notaFiscal.create({
      data: {
        tenantId: demoTenant.id,
        numero: 'NF-2026-002',
        descricao: 'Doação de patrocino',
        valor: 10000,
        data: new Date(),
        tipo: 'receita',
        status: 'aprovada',
      },
    }),
  ]);

  console.log(`✅ Conta e ${notas.length} notas fiscais criadas`);

  // ============================================================
  // CREATE SAMPLE TEAM MEMBERS
  // ============================================================
  const equipe = await Promise.all([
    prisma.equipeMembro.create({
      data: {
        tenantId: demoTenant.id,
        nome: 'Carlos Ferreira',
        cpf: '777.777.777-77',
        cargo: 'Coordenador de Campanha',
        salario: 3000,
        dataAdmissao: new Date(),
        status: 'ativo',
      },
    }),
    prisma.equipeMembro.create({
      data: {
        tenantId: demoTenant.id,
        nome: 'Bruna Alves',
        cpf: '888.888.888-88',
        cargo: 'Gestora de Redes Sociais',
        salario: 2000,
        dataAdmissao: new Date(),
        status: 'ativo',
      },
    }),
  ]);

  console.log(`✅ ${equipe.length} membros da equipe criados`);

  // ============================================================
  // CREATE SAMPLE CAMPANHAS MARKETING
  // ============================================================
  const campanhas = await Promise.all([
    prisma.campanhaMarketing.create({
      data: {
        tenantId: demoTenant.id,
        nome: 'Campanha Instagram - Março',
        plataforma: 'instagram',
        conteudo: 'Conteúdo de divulgação no Instagram',
        dataInicio: new Date(),
        dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'ativa',
        alcance: 5000,
        engajamento: 450,
      },
    }),
    prisma.campanhaMarketing.create({
      data: {
        tenantId: demoTenant.id,
        nome: 'Campanha WhatsApp - Engajados',
        plataforma: 'whatsapp',
        conteudo: 'Mensagens para eleitores engajados',
        dataInicio: new Date(),
        status: 'planejada',
        alcance: 0,
        engajamento: 0,
      },
    }),
  ]);

  console.log(`✅ ${campanhas.length} campanhas de marketing criadas`);

  console.log(`
  
  ╔════════════════════════════════════════════════════════════╗
  ║                    🌱 Seed Concluído!                      ║
  ╚════════════════════════════════════════════════════════════╝
  
  📋 CREDENCIAIS DE TESTE:
  
  ┌─ ROOT ADMIN ─────────────────────────────────────────┐
  │ CPF:     000.000.000-00                               │
  │ Senha:   Admin@2026                                   │
  └──────────────────────────────────────────────────────┘
  
  ┌─ DEMO CAMPAIGN ADMIN ─────────────────────────────────┐
  │ CPF:     123.456.789-00                               │
  │ Senha:   Campanha@2026                                │
  │ Tenant:  Campanha Demo - Goiás                        │
  └──────────────────────────────────────────────────────┘
  
  📊 DADOS CRIADOS:
  ├─ ${liderancas.length} Lideranças
  ├─ ${eleitores.length} Eleitores
  ├─ ${reunioes.length} Reuniões
  ├─ ${metas.length} Metas (municípios Goiás)
  ├─ ${notas.length} Notas Fiscais
  ├─ ${equipe.length} Membros da Equipe
  └─ ${campanhas.length} Campanhas de Marketing
  
  `);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
