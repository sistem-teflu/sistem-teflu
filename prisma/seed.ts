import { APP_MODULES } from "@/lib/constants";
import prisma from "@/lib/prisma"

const ACTIVITIES = [
    { component: "VIDA UTIL", procedure: "CAPTURA CANTIDAD DE PIEZAS QUE SE HICIERON EN EL MES..." },
    { component: "BOQUILLA", procedure: "Revisar que Boquilla se encuentre en buen estado, sin desgaste..." },
    { component: "GUIA DE ACOMPAÑAMIENTO", procedure: "Verificar que guía esté libre de rayas, grietas y despostilladuras..." },
    { component: "MANDRIL", procedure: "Revisar que no tenga desgaste, despostilladuras, grietas..." },
    { component: "MORDAZA", procedure: "Verificar que Mordaza esté libre de rayas, grietas..." },
    { component: "POSTE", procedure: "Revisar poste que no tenga desgaste, golpes..." },
    { component: "RODAJA", procedure: "Revisar que esté libre de despostilladuras, checar tornillos..." },
    { component: "WIPER", procedure: "Revisar que no tenga desgaste, despostilladuras, marcas..." },
]

async function main() {
    console.log("Sembrando actividades de herramental...")
    await prisma.toolingActivity.createMany({
        data: ACTIVITIES
    })
    
    // Crear un herramental de prueba
    await prisma.tooling.create({
        data: {
            code: "{D228-171.45-04}",
            description: "D-228 MTD 63.5 X 50.8 MM REV. 1"
        }
    })
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });