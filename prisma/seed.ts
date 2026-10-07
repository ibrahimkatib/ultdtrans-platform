import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/security';

const passwordHash = hashPassword('Password123!');

async function main(){
  await prisma.projectActivity.deleteMany();
  await prisma.message.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.projectFile.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.project.deleteMany();
  await prisma.translatorLanguage.deleteMany();
  await prisma.translatorSpecialization.deleteMany();
  await prisma.translatorProfile.deleteMany();
  await prisma.specialization.deleteMany();
  await prisma.language.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const languages = await Promise.all([
    ['Arabic','ar'],['English','en'],['Dutch','nl'],['German','de'],['French','fr'],['Spanish','es'],['Italian','it'],['Turkish','tr'],['Portuguese','pt'],['Polish','pl'],['Ukrainian','uk']
  ].map(([name,code])=>prisma.language.create({data:{name,code}})));
  const language=(code:string)=>languages.find(x=>x.code===code)!;
  const specNames=['Legal','Medical','Financial','Technical','IT & Software','Marketing','Academic','General','Localization','Subtitling'];
  const specs=await Promise.all(specNames.map(name=>prisma.specialization.create({data:{name}})));
  const spec=(name:string)=>specs.find(x=>x.name===name)!;

  const client=await prisma.user.create({data:{email:'client@ultdtrans.test',passwordHash,displayName:'Sarah Mitchell',role:'CLIENT',timezone:'Europe/Amsterdam',clientProfile:{create:{companyName:'Northbridge Consulting',companyRole:'Operations Manager',billingName:'Northbridge Consulting BV',billingEmail:'billing@northbridge.test'}}}});
  const translatorUser=await prisma.user.create({data:{email:'translator@ultdtrans.test',passwordHash,displayName:'Omar Khalil',role:'TRANSLATOR',timezone:'Europe/Amsterdam',translatorProfile:{create:{bio:'Arabic-English translator specializing in legal, financial and technical content.',yearsExperience:8,translationRate:0.055,proofreadingRate:0.028,mtpeRate:0.024,availability:'AVAILABLE',availableFrom:'09:00',availableTo:'17:00',verified:true,averageRating:4.8}}}});
  const translator=await prisma.translatorProfile.findUniqueOrThrow({where:{userId:translatorUser.id}});
  const manager=await prisma.user.create({data:{email:'manager@ultdtrans.test',passwordHash,displayName:'ULTD TRANS Manager',role:'MANAGER',timezone:'Europe/Amsterdam'}});

  await prisma.translatorLanguage.createMany({data:[
    {translatorId:translator.id,languageId:language('ar').id,level:'Native',isNative:true},
    {translatorId:translator.id,languageId:language('en').id,level:'C2',isNative:false},
    {translatorId:translator.id,languageId:language('nl').id,level:'B2',isNative:false},
  ]});
  await prisma.translatorSpecialization.createMany({data:[{translatorId:translator.id,specializationId:spec('Legal').id},{translatorId:translator.id,specializationId:spec('Financial').id},{translatorId:translator.id,specializationId:spec('IT & Software').id}]});

  const projectA=await prisma.project.create({data:{reference:'ULTD-26001',title:'Annual financial report',description:'Translate the annual financial report for board review.',clientId:client.id,translatorId:translator.id,managerId:manager.id,sourceLanguageId:language('ar').id,targetLanguageId:language('en').id,serviceType:'AI_HUMAN_REVIEW',status:'REVIEW',priority:'HIGH',specialization:'Financial',wordCount:4200,price:147,deadline:new Date(Date.now()+3*86400000)}});
  await prisma.quote.create({data:{projectId:projectA.id,baseRate:.035,wordCount:4200,subtotal:147,total:147,currency:'EUR',validUntil:new Date(Date.now()+7*86400000)}});
  const projectB=await prisma.project.create({data:{reference:'ULTD-26002',title:'Website localization',description:'Localize product pages from English into Dutch.',clientId:client.id,translatorId:null,managerId:manager.id,sourceLanguageId:language('en').id,targetLanguageId:language('nl').id,serviceType:'HUMAN',status:'MATCHING',priority:'MEDIUM',specialization:'Localization',wordCount:1800,price:144,deadline:new Date(Date.now()+7*86400000)}});
  await prisma.quote.create({data:{projectId:projectB.id,baseRate:.08,wordCount:1800,subtotal:144,total:144,currency:'EUR',validUntil:new Date(Date.now()+7*86400000)}});
  const projectC=await prisma.project.create({data:{reference:'ULTD-26003',title:'Quick internal memo',description:'Low-cost internal translation for a non-public working draft.',clientId:client.id,translatorId:null,managerId:manager.id,sourceLanguageId:language('de').id,targetLanguageId:language('en').id,serviceType:'AI',status:'COMPLETED',priority:'LOW',specialization:'General',wordCount:950,price:14.25,deadline:new Date(Date.now()-2*86400000)}});
  await prisma.quote.create({data:{projectId:projectC.id,baseRate:.015,wordCount:950,subtotal:14.25,total:14.25,currency:'EUR',validUntil:new Date(Date.now()+7*86400000)}});
  await prisma.message.createMany({data:[{projectId:projectA.id,senderId:client.id,body:'Please keep the financial terminology consistent with our previous report.'},{projectId:projectA.id,senderId:translatorUser.id,body:'Understood. I will keep the terminology consistent and flag any ambiguous source text.'}]});
  await prisma.projectActivity.createMany({data:[{projectId:projectA.id,actorId:manager.id,action:'PROJECT_CREATED'},{projectId:projectA.id,actorId:manager.id,action:'TRANSLATOR_ASSIGNED'},{projectId:projectA.id,actorId:translatorUser.id,action:'STATUS_IN_PROGRESS'},{projectId:projectA.id,actorId:translatorUser.id,action:'STATUS_REVIEW'},{projectId:projectB.id,actorId:manager.id,action:'PROJECT_CREATED'}]});
  await prisma.notification.createMany({data:[{userId:client.id,title:'Project ready for review',body:'ULTD-26001 is waiting for your review.'},{userId:translatorUser.id,title:'Keep your profile current',body:'Your verified profile is ready for new project matching.'},{userId:manager.id,title:'New matching request',body:'ULTD-26002 needs a translator for English → Dutch localization.'}]});
  console.log('ULTD TRANS seed completed.');
}

main().catch(error=>{console.error(error);process.exit(1)}).finally(()=>prisma.$disconnect());
