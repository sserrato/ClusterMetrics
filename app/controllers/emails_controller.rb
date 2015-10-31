class EmailsController < ApplicationController
  def new
    @email = Email.new
    @bridgevalues = Email::BRIDGEVALUE
  end

  def create
    @email = Email.new email_params
    if @email.save
      redirect_to ('/')
    else
      render 'new'
    end
  end

  def show
  end

  def load
    @emails = Email.all.order('id DESC')

    @domainsCategories =  {"126.com"=>9998,
    "163.com"=>9998,
    "3snews.net"=>0,
    "4sign.se"=>0,
    "7x24.cn"=>0,
    "a-relation.se"=>2,
    "academicinternshipcouncil.org"=>9998,
    "account.microsoft.com"=>9998,
    "accounts.google.com"=>9998,
    "actiondialog.se"=>9998,
    "adobe-direct.com"=>0,
    "adobe-emea.com"=>9998,
    "adobe.com"=>9998,
    "afconsult.com"=>0,
    "agility.com"=>9998,
    "ajprodukter.se"=>9998,
    "akademssr.se"=>2,
    "alltomjuridik.se"=>9998,
    "almedalsbaten.se"=>9998,
    "anido.se"=>2,
    "anp.se"=>9998,
    "antispam2.lst.se"=>9998,
    "apolarchina.com"=>9998,
    "apricon.se"=>2,
    "arbetarbladet.se"=>0,
    "arbetsformedlingen.se"=>0,
    "areax.se"=>2,
    "Arkitektkopia.se"=>0,
    "arneblom.se"=>2,
    "aronssons.se"=>2,
    "art4m.se"=>9998,
    "atomerochbitar.se"=>0,
    "attituderec.com"=>9998,
    "avisera.se"=>9998,
    "avrexpos.com"=>6,
    "azuredragontravel.com"=>9998,
    "balnor.se"=>2,
    "bambuser.com"=>0,
    "baringo.se"=>0,
    "bastsaljaren.se"=>9998,
    "bergakra.se"=>2,
    "BIGTRAVEL.SE"=>9998,
    "billerudkorsnas.com"=>2,
    "birgittapiippola.se"=>2,
    "blabsweden.com"=>2,
    "blabsweden.se"=>2,
    "bollnas.se"=>0,
    "bounce.linkedin.com"=>9998,
    "bounce.meint.se"=>0,
    "brandsforfans.se"=>2,
    "brann.se"=>0,
    "bridgeinnov.com"=>0,
    "bristol.ac.uk"=>6,
    "britishairways.com"=>9998,
    "brynas.se"=>2,
    "business-sweden.se"=>4,
    "ca-cib.com"=>6,
    "cantab.nu"=>2,
    "canterbury.ac.nz"=>6,
    "capitala.se"=>9998,
    "cartesia.se"=>2,
    "ccavenue.com"=>6,
    "CE.org"=>2,
    "cebexgroup.com"=>2,
    "cegeoic2015.net"=>9998,
    "centralsweden.be"=>4,
    "chillawear.se"=>9998,
    "chinadaily.com.cn"=>6,
    "chinaittc.org"=>6,
    "chinavpshosting.com"=>6,
    "choice.se"=>9998,
    "cibesliftgroup.com"=>2,
    "cision.com"=>9998,
    "cluster-development.com"=>5,
    "cluster55.org"=>5,
    "clusterland.at"=>5,
    "cmail1.com"=>9998,
    "cmail2.com"=>9998,
    "cmail3.com"=>9998,
    "coffeecenter.se"=>9998,
    "compare.se"=>5,
    "connecteastafrica.com"=>6,
    "coor.com"=>2,
    "corp.elong.com"=>6,
    "createsend1.com"=>9998,
    "createsend4.com"=>9998,
    "crm-langhamhotels.com"=>6,
    "cromea.se"=>2,
    "ctrip.com"=>9998,
    "curtin.edu.au"=>6,
    "cutler.se"=>2,
    "ddp.se"=>0,
    "dhl.com"=>9998,
    "di.se"=>0,
    "digitalcenter.org"=>6,
    "digitalmarketingdepot.com"=>6,
    "dios.se"=>2,
    "dmd.idg.se"=>9998,
    "doodle.com"=>9998,
    "dream-spo.com"=>6,
    "drivhuset.se"=>1,
    "dropbox.com"=>9998,
    "dropboxmail.com"=>9998,
    "du.se"=>0,
    "dustin.se"=>9998,
    "e-mail.microsoft.com"=>0,
    "e.globearenas.se"=>2,
    "e.linkedin.com"=>9998,
    "e3pl.se"=>2,
    "easytranslate.se"=>9998,
    "easytryck.se"=>2,
    "ec.europa.eu"=>4,
    "echallenges.org"=>6,
    "eco-business.com"=>6,
    "eecw.com.au"=>6,
    "ellensskafferi.se"=>2,
    "elmia.se"=>0,
    "Elvelid"=>9998,
    "elvelid.com"=>0,
    "email.carlsonhotels.com"=>9998,
    "email.microsoftonline.com"=>9998,
    "email.ticnet.se"=>9998,
    "email.vimeo.com"=>0,
    "emailing.3ds.com"=>9998,
    "emailing.cafe-frappe.fr"=>9998,
    "engelska.se"=>7,
    "eskilstuna.se"=>4,
    "esri.com"=>6,
    "esri.se"=>2,
    "estimote.com"=>6,
    "eupic.org.cn"=>6,
    "eurohealthnet.eu"=>0,
    "eusmecentre.org.cn"=>6,
    "eventbrite.com"=>0,
    "f-bolaget.se"=>9998,
    "facebookmail.com"=>0,
    "factoryshopgavle.com"=>9998,
    "fenrir.se"=>2,
    "fiberdata.se"=>2,
    "fiberopticvalley.com"=>5,
    "findit-solutions.com"=>9998,
    "findit-solutions.se"=>9998,
    "finnair.com"=>6,
    "fittogether.se"=>2,
    "flysas.com"=>9998,
    "folkuniversitetet.se"=>7,
    "foretagarforum.com"=>4,
    "foretagsbladet.se"=>2,
    "foretagsringen.se"=>5,
    "foretagstv.com"=>9998,
    "formgren.com"=>2,
    "foxmail.com"=>6,
    "fpx.se"=>9998,
    "freemanco.com"=>6,
    "fudan.edu.cn"=>0,
    "gastidr.se"=>2,
    "gastrikeatervinnare.se"=>4,
    "gastrikevatten.se"=>4,
    "gavle.se"=>4,
    "gavlecentrumsamverkan.se"=>5,
    "gavlecvb.se"=>0,
    "gavlefastigheter.se"=>4,
    "gavlegardarna.se"=>4,
    "gavlenet.se"=>9998,
    "gavleoffset.se"=>0,
    "gd.se"=>2,
    "gdfao.gov.cn"=>6,
    "geoforum.no"=>6,
    "geog.ucsb.edu"=>6,
    "geomaticsnorway.no"=>6,
    "geomatikk.se"=>0,
    "geospatialmedia.net"=>5,
    "gestrikemagasinet.se"=>2,
    "getitsafe.com"=>2,
    "getpocket.com"=>9998,
    "ghd.com"=>6,
    "giffarna.se"=>2,
    "gisprocess.com"=>2,
    "gleammusic.com"=>9998,
    "gmail.com"=>9998,
    "gmmm.se"=>2,
    "goodliving.nu"=>9998,
    "google.com"=>0,
    "gov.se"=>4,
    "grandmillenniumbeijing.com"=>0,
    "greencity.iro3.com"=>9998,
    "haier.com"=>6,
    "halsansnyaverktyg.se"=>5,
    "halsingland.se"=>5,
    "hammerin.se"=>2,
    "hardrockhotelsd.com"=>9998,
    "hariett.se"=>2,
    "health.wa.gov.au"=>6,
    "hedlunds-vvs.se"=>2,
    "hexagongeospatial.com"=>2,
    "hhs.se"=>0,
    "hig.se"=>3,
    "highvoltagevalley.se"=>0,
    "hktdc.com"=>9998,
    "hktdc.org"=>6,
    "hktrader.hktdc.com"=>6,
    "hna.se"=>0,
    "home.se"=>0,
    "hotels.com"=>6,
    "hotmail.co.uk"=>9998,
    "hotmail.com"=>9998,
    "hotmail.se"=>9998,
    "hsiinfo.se"=>2,
    "hutb.se"=>7,
    "hxgnlive.com"=>2,
    "i2i.se"=>2,
    "iad.se"=>0,
    "icloud.com"=>9998,
    "id.apple.com"=>0,
    "IHTBollnas.onmicrosoft.com"=>0,
    "iis.se"=>4,
    "ilector.se"=>0,
    "imgartists.com"=>6,
    "incoax.com"=>2,
    "infobas.se"=>2,
    "ingstad.se"=>2,
    "inkopgavleborg.se"=>4,
    "Inlandsinnovation.se"=>4,
    "inno-creativeab.com"=>2,
    "innovation-impact.se"=>0,
    "innovativecity.iro3.com"=>9998,
    "InsideApple.Apple.com"=>9998,
    "insideicloud.icloud.com"=>0,
    "interflora.se"=>2,
    "interpool.se"=>2,
    "invotech.se"=>2,
    "iqs.se"=>2,
    "it-services.me"=>9998,
    "itmaskinen.se"=>2,
    "itmmobile.com"=>9998,
    "itsfuture.se"=>0,
    "ivl.se"=>3,
    "joyoaudio.com"=>6,
    "juicymaps.com"=>2,
    "julong.com.cn"=>6,
    "kairosfuture.com"=>0,
    "kau.se"=>0,
    "ki.se"=>3,
    "klarna.se"=>0,
    "klog.se"=>9998,
    "knowit.se"=>2,
    "kommunikation.sj.se"=>9998,
    "komplett.se"=>9998,
    "KONFE"=>9998,
    "kontigo.se"=>2,
    "kontorspoolen.se"=>9998,
    "krigsmyter.nu"=>9998,
    "kristdemokraterna.se"=>4,
    "kuntin.com"=>6,
    "kvadrat.se"=>2,
    "landgate.wa.gov.au"=>6,
    "landraddningen.se"=>2,
    "lansforsakringar.com"=>2,
    "lansforsakringar.se"=>2,
    "lansstyrelsen.se"=>4,
    "leadscloud.net"=>9998,
    "leadsforseeds.com"=>6,
    "lehmannskok.se"=>9998,
    "lexicon.se"=>2,
    "lfgavleborg.se"=>0,
    "lg.se"=>4,
    "linkedin.com"=>9998,
    "lists.CE.org"=>9998,
    "liu.se"=>7,
    "live.cn"=>9998,
    "live.se"=>0,
    "lm.se"=>4,
    "logiwaste.se"=>2,
    "lonnsbuss.se"=>2,
    "loopia.se"=>9998,
    "lyyti.fi"=>6,
    "mac.com"=>0,
    "magnusson.nu"=>2,
    "mail.hotels.com"=>9998,
    "mail11.wdc01.mcdlv.net"=>9998,
    "mail128.atl61.mcsv.net"=>9998,
    "mail134.atl61.mcsv.net"=>9998,
    "mail141.wdc01.mcdlv.net"=>9998,
    "mail141.wdc02.mcdlv.net"=>9998,
    "mail142.atl101.mcdlv.net"=>9998,
    "mail149.atl81.rsgsv.net"=>9998,
    "mail155.atl121.mcsv.net"=>9998,
    "mail186.wdc02.mcdlv.net"=>9998,
    "mail37.atl11.rsgsv.net"=>9998,
    "mail39.atl31.mcdlv.net"=>9998,
    "mail44.atl31.mcdlv.net"=>9998,
    "mail45.atl31.mcdlv.net"=>9998,
    "mail62.atl111.rsgsv.net"=>9998,
    "mail71.us4.mcsv.net"=>9998,
    "mailchimp.com"=>0,
    "mailings.elite-kontorsstolar.se"=>9998,
    "mailtao.com"=>9998,
    "mapandcoach.se"=>2,
    "market-ro.eu"=>9998,
    "marketingland.com"=>9998,
    "max.se"=>9998,
    "mcgloballoyaltyclub.com"=>6,
    "mdlnk.se"=>0,
    "me.com"=>9998,
    "meetup.com"=>9998,
    "mejlcenter.eu"=>0,
    "meltwater.com"=>0,
    "metria.se"=>2,
    "mhk.cci.se"=>5,
    "microsoft.com"=>9998,
    "migrationsverket.se"=>0,
    "miljorapporten.se"=>2,
    "mindfulbusiness.nu"=>2,
    "mintind.com"=>6,
    "mitt-barn.se"=>2,
    "mittmedia.se"=>2,
    "mlnewsletterse.com"=>9998,
    "mm.loc"=>9998,
    "mms-email.telenor.se"=>9998,
    "mms.telia.com"=>0,
    "mobilbusiness.se"=>0,
    "moderat.se"=>9998,
    "monemus.se"=>0,
    "montellpartners.se"=>6,
    "movexum.se"=>1,
    "mrinfo.se"=>2,
    "msiprod.com"=>6,
    "multitronic.se"=>0,
    "musitag.com"=>9998,
    "myairbridge.com"=>9998,
    "mybasis.com"=>9998,
    "myheritage.com"=>9998,
    "mynewsdesk.com"=>0,
    "naturlara.se"=>7,
    "nci-ab.com"=>9998,
    "nervelabs.se"=>2,
    "new.itunes.com"=>9998,
    "newplace.se"=>2,
    "news.projectplace.com"=>9998,
    "news.spotifymail.com"=>9998,
    "nfi.se"=>0,
    "noaq.com"=>2,
    "nordea.se"=>2,
    "normannpartners.com"=>6,
    "norrlandsfonden.se"=>1,
    "nospse.emea.microsoftonline.com"=>9998,
    "notifications.skype.com"=>9998,
    "novogit.se"=>2,
    "nsecc.fi"=>5,
    "nyhetsbrev.dagensps.se"=>9998,
    "nyhetsbrev.dagensvd.se"=>9998,
    "nymangraphics.se"=>2,
    "nyteknik.se"=>2,
    "oculus.com"=>6,
    "oculusvr.com"=>6,
    "ohappa.se"=>9998,
    "one.com"=>9998,
    "onlineupdate.com"=>9998,
    "orbiz.com.br"=>9998,
    "oslomedtech.no"=>6,
    "outlook.com"=>0,
    "paperprovince.com"=>0,
    "parker-software.com"=>6,
    "paypal.se"=>9998,
    "phonehouse.se"=>0,
    "planbab.com"=>2,
    "playipp.com"=>0,
    "plma.se"=>9998,
    "plus.google.com"=>9998,
    "pne.skanova.net"=>2,
    "polisen.se"=>0,
    "ponchospecialist.eu"=>9998,
    "position2015.se"=>2,
    "posten.se"=>9998,
    "prepedyouth.se"=>2,
    "proandpro.se"=>2,
    "processum.se"=>9998,
    "procurator.se"=>2,
    "projects.se"=>2,
    "projekt-parken.se"=>2,
    "prylstaden.se"=>9998,
    "qq.com"=>9998,
    "r.grouponmail.se"=>9998,
    "rapatac.se"=>0,
    "rawfoodmiddagar.com"=>9998,
    "rawfoodmiddagar.se"=>9998,
    "rcon-sweden.se"=>2,
    "rdabrisbane.org.au"=>2,
    "reflectus.se"=>2,
    "regeringen.se"=>9998,
    "regeringskansliet.se"=>4,
    "regiongavleborg.se"=>4,
    "regus.com"=>6,
    "reply.thirddoormedia.com"=>9998,
    "Resekompani.se"=>2,
    "restaurangteknikparken.se"=>2,
    "retriever.se"=>0,
    "roadroid.com"=>2,
    "robotdalen.se"=>5,
    "s-group.se"=>2,
    "sacc-usa.ccsend.com"=>9998,
    "sandbackapark.com"=>5,
    "sandbergmail.com"=>9998,
    "sandvik.com"=>2,
    "sandviken.se"=>4,
    "sas.se"=>9998,
    "sc-ab.com"=>2,
    "schullerquist.se"=>0,
    "se.gt.com"=>2,
    "se.pwc.com"=>0,
    "searchengineland.com"=>9998,
    "searchmarketingexpo.com"=>9998,
    "seb.se"=>0,
    "secure.se"=>2,
    "seesaw.se"=>2,
    "service.alibaba.com"=>9998,
    "service.govdelivery.com"=>9998,
    "service.ushi.cn"=>9998,
    "service.zalando.se"=>9998,
    "sg.booking.com"=>9998,
    "sgroup-solutions.se"=>2,
    "sgu.se"=>0,
    "shangri-la.com"=>0,
    "shmu.edu.cn"=>6,
    "sics.se"=>3,
    "singaporeair.com.sg"=>6,
    "sipu.se"=>7,
    "sis.se"=>3,
    "sisp.se"=>0,
    "sj.se"=>9998,
    "skatteverket.se"=>4,
    "skl.se"=>4,
    "skola.gavle.se"=>0,
    "smartbrief.com"=>9998,
    "smartdata.iro3.com"=>9998,
    "snyggmedia.se"=>2,
    "socialforum.se"=>2,
    "sodexo.com"=>6,
    "sp.se"=>0,
    "sprend.com"=>9998,
    "stalquist.se"=>2,
    "standardbolag.se"=>2,
    "steadson.com"=>2,
    "student.hig.se"=>0,
    "student.su.se"=>7,
    "studiolisabengtsson.se"=>2,
    "sundaramappliedtechnologies.com"=>6,
    "supportia.se"=>9998,
    "sustainable-sweden.se"=>5,
    "svartpist.com"=>2,
    "svbrf.com"=>0,
    "svepost.se"=>9998,
    "sverigesradio.se"=>0,
    "sweco.se"=>2,
    "swecogroup.com"=>2,
    "swedalar.se"=>6,
    "swedenict.com"=>5,
    "swedesurvey.se"=>2,
    "swedishchamber.com.cn"=>4,
    "systemalerts3.mailchimp.com"=>9998,
    "systemalerts4.mailchimp.com"=>9998,
    "tailor-madeapparel.com"=>0,
    "techsoup.se"=>2,
    "teknikdalen.se"=>5,
    "teknikparken.se"=>0,
    "telefonkonferens.nu"=>9998,
    "telekomnyheterna.se"=>9998,
    "telia.com"=>9998,
    "telia.se"=>9998,
    "temagon.se"=>2,
    "tematik.se"=>2,
    "tendensor.se"=>2,
    "teria.se"=>2,
    "terrafirma.se"=>2,
    "theeyetribe.com"=>6,
    "thekerryhotels.com"=>9998,
    "thomassandberg.se"=>2,
    "tii.se"=>0,
    "tillvaxtverket.se"=>4,
    "toimprove.se"=>2,
    "trafikverket.se"=>4,
    "transpacificip.com"=>6,
    "travelfinder.se"=>9998,
    "tripit.com"=>9998,
    "triplesteelix.se"=>0,
    "trr.se"=>0,
    "tru.ca"=>6,
    "trycktrean.se"=>2,
    "tsg.la"=>6,
    "tuke.sk"=>6,
    "tumblr.com"=>9998,
    "tv4.se"=>0,
    "twitter.com"=>9998,
    "uadm.uu.se"=>7,
    "ubifrance.fr"=>6,
    "uli.se"=>5,
    "ungforetagsamhet.se"=>0,
    "unikum.net"=>0,
    "unionen.se"=>9998,
    "united.com"=>9998,
    "uppsalabio.se"=>0,
    "utskick.personalrabatten.se"=>9998,
    "utskick.sportadmin.se"=>9998,
    "vansterpartiet.se"=>4,
    "vaultpress.com"=>6,
    "vdivde-it.de"=>0,
    "vgocom.com"=>9998,
    "vikingline.com"=>2,
    "viktoria.se"=>2,
    "vimeo.com"=>9998,
    "ving.se"=>2,
    "vinguiden.com"=>9998,
    "VINNOVA.se"=>4,
    "visaforchina.org"=>0,
    "visma.com"=>0,
    "webserviceindex.se"=>9998,
    "wheresmysuitcase.com"=>6,
    "whu.edu.cn"=>6,
    "wiccon.se"=>2,
    "winn.se"=>0,
    "wish.com"=>6,
    "wordpress.com"=>9998,
    "yahoo.com"=>9998,
    "yahoo.se"=>9998,
    "youtube.com"=>9998,
    "yugongyishan.com"=>6}
  end

  def import
    Email.import(params[:file])
    redirect_to emails_classify_path, notice: "Emails imported."
  end

  def classify
    @emails_bridge0 = Email.where("bridge = '0' AND email_frequency >='4'").order("id DESC")
    respond_to do |format|
      format.html
      format.csv {send_data @emails_bridge0.to_csv}
      format.xls {send_data @emails_bridge0.to_csv(col_sep: "\t")}
      format.json {send_data @emails_bridge0.to_json}
    end
  end

  def edit
    @email = Email.find(params[:id])
    Rails.logger.debug params.inspect
  end

  def update
      @email = Email.find(params[:id])
      # Email.where("bridge = '0'").first[:id]
        if @email.update(email_params)
          @redirect_next_edit = Email.where("bridge = '0'").first
          redirect_to edit_email_path(@redirect_next_edit)
        else
          render edit_email
        end
    end


  private
  def email_params
    params.require(:email).permit(:emaildomain, :bridge, :bridge_global, :email_frequency, :month, :year, :cluster_id)
  end
end
