import styler from "./index.vue";
import PdfDocPublisher from './pdfstyler/components/docpublisher.vue'
import HtmlDocPublisher from './htmlstyler/components/docpublisher.vue'
export default [
  {
    path: "/docstyler/:repouser/:reponame/:repobranch",
    component: styler,
    name: "styler"
  },
  {
    path: "/pdfdocstyler/docpublisher/:repouser/:reponame/:repobranch",
    component: PdfDocPublisher,
    name: "PdfDocPublisher"
  },
  {
    path: "/htmldocstyler/docpublisher/:repouser/:reponame/:repobranch",
    component: HtmlDocPublisher,
    name: "HtmlDocPublisher"
  },
  
];