import { defineStore } from "pinia";
import { Notify } from "quasar";
import { api } from "src/boot/axios";
import { useAuthStore } from "./auth";

export const useReportsStore = defineStore("reports", {
  state: () => ({
    reports: [],
    min_date: "",
    admitReports: [],
    types: ["Semanal", "Mensual", "Anual"],
  }),

  getters: {
    getReportById(state) {
      return (id) => state.reports.find((report) => report.id == id);
    },
    getNumByType(state) {
      return (type) => state.types.indexOf(type);
    },
    getTypeByNum(state) {
      return (num) => state.types[num - 1];
    },
  },

  actions: {
    async saveReport(name, type, endDate, products) {
      const t = this.getNumByType(type) + 1;
      const date = new Date(endDate);
      const end = date.toISOString();
      console.log(end);
      const report = {
        name: name,
        type: t,
        endDate: end,
        products: products,
      };
      try {
        const data = await (await api.post("/reports/create", report)).data;
        if (data != null) {
          this.reports.push(data);
          Notify.create({
            message: "Reporte añadido",
            color: "info",
          });
        }
      } catch (error) {
        console.log(error);
        Notify.create({
          message: "Error al añadir reporte",
          color: "warning",
        });
      }
    },
    async getAllReports() {
      try {
        const data = await (await api.get("/reports")).data;
        this.reports = data;
        this.addTypes(this.reports);
      } catch (error) {
        console.log(error);
      }
    },
    async deleteReport(id) {
      try {
        await (
          await api.delete(`/reports/${id}`)
        ).data;
        Notify.create({
          color: "info",
          message: "Eliminado",
        });
        const deleted = this.getReportById(id);
        const index = this.reports.indexOf(deleted);
        this.reports.splice(index, 1);
      } catch (error) {
        console.log(error);
        Notify.create({
          color: "warning",
          message: "Error al eliminar el reporte",
        });
      }
    },
    addTypes(reports) {
      reports.forEach((report) => {
        report.type = this.getTypeByNum(report.type);
      });
    },
    async exportPDF(id) {
      const report = this.getReportById(id);
      try {
        const pdf = await api.get(`/reports/${id}/export-pdf`, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([pdf.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${report.name}.pdf`);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.log(error);
        Notify.create({
          message: "Error al exportar PDF",
          color: "warning",
        });
      }
    },
    async exportExcel(id) {
      const report = this.getReportById(id);
      try {
        const excel = await api.get(`/reports/${id}/export-excel`, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([excel.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${report.name}.xlsx`);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.log(error);
        Notify.create({
          message: "Error al exportar PDF",
          color: "warning",
        });
      }
    },
    async getMinDateReport() {
      try {
        const auth = useAuthStore();
        const data = await (await api.get(`/my-orders/min-date`)).data;
        const date = new Date(data ? data : "1970/01/01");
        this.min_date = `${date.getFullYear()}/${date.getMonth() + 1}/${
          date.getDate() + 1
        }`;
        const end = new Date();
        this.admitTypeByRange(date, end);
      } catch (error) {
        console.log(error);
      }
    },
    admitTypeByRange(start, end) {
      /**
       * Esto es para convertir de ms a dias
       */
      this.admitReports = [];
      const diff = (end - start) / 86400000;
      // if (diff >= 1) {
      //   this.admitReports.push("Diario");
      // }
      if (diff >= 7) {
        this.admitReports.push("Semanal");
      }
      if (diff >= 28) {
        this.admitReports.push("Mensual");
      }
      if (diff >= 365) {
        this.admitReports.push("Anual");
      }
    },
  },
});
