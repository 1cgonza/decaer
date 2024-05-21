import { readdir } from 'fs/promises';
import { extname, join, parse, resolve } from 'path';
import ffmpeg from 'ffmpeg-static';
import { spawn } from 'child_process';
import slug from 'slugify';

const baseCapturas = 'C:/Users/enflujo/Documents/__DECAER__/Capturas';
interface Grupo {
  nombre: string;
  ruta: string;
  efectos: string[];
}

const efectosGenerales = [
  'hflip', // invertir horizontal
  'rotate=PI:bilinear=0', // rotar 180
  'curves=psfile=./fuente/lobo1.acv',
  'eq=saturation=0.5',
  // 'eq=brightness=0.12:saturation=2',
];

const grupos = [
  {
    nombre: 'Lobo en campo',
    ruta: join(baseCapturas, 'tinta/tinta_003.dgn/tinta_003_Take_01/tinta_003_01_X1'),
    efectos: efectosGenerales,
  },
  {
    nombre: 'Mirada lobo',
    ruta: join(baseCapturas, 'tinta/tinta_003.dgn/tinta_003_Take_02/tinta_003_02_X1'),
    efectos: efectosGenerales,
  },
];

inicio().catch(console.error);

async function inicio() {
  for (const grupo of grupos) {
    await procesarCarpeta(grupo);
  }
}

async function procesarCarpeta(grupo: Grupo) {
  if (!ffmpeg) return;

  try {
    const archivos = (await readdir(grupo.ruta)).filter((a) => extname(a) === '.jpg');
    const nombreBase = parse(grupo.ruta).base;
    const nombreVideo = slug(grupo.nombre, { lower: true });
    const parametrosVideo = [
      '-framerate',
      '12',
      '-pattern_type',
      'sequence',
      '-i',
      `${join(grupo.ruta, `${nombreBase}_%04d.jpg`)}`,
      '-vf',
      grupo.efectos ? grupo.efectos.join(',') : '',
      '-s:v',
      '1620x1080',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuyv422',
      '-y',
      `${resolve(process.cwd(), `${nombreVideo}.mp4`)}`,
    ];

    // console.log(nombreVideo);
    // ffmpeg -framerate 1 -pattern_type sequence -i gym%02d.jpg -s:v 1920x1080 -c:v libx264 -pix_fmt yuv420p out.mp4

    const { stdout, stderr } = spawn(ffmpeg, parametrosVideo);
    stdout.on('data', (data) => console.log(data.toString()));
    stderr.on('data', (data) => console.error(data.toString()));
    stdout.on('end', () => {
      console.log('Video procesado:', nombreVideo);
    });
    console.log(parametrosVideo.join(' '));

    // for (const archivo of archivos) {
    //   console.log(grupo.nombre, archivo);
    // }
  } catch (error) {
    console.error(error);
  }
}
