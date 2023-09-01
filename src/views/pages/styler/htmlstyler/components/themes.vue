<template>
  <div>
    <h5 class=" text-primary title p-2 bg-light mb-2">Select Theme</h5>
    <div class="col-lg-12 col-xl-6">
      <div class="image-options d-flex flex-wrap justify-content-center">
        <div class="image-option text-dark h6 my-3" v-for="(image, index) in imageOptions" :key="index" @click="selectImage(image)">
          <b-card :img-src="getImagePath(image)" img-alt="Card image"
            :class="{ 'selected-image ': selectedTheme === image }">
            <b-card-text>
              <input type="radio" :value="image" v-model="selectedTheme"
                style="display: none; width: fit-content; font-weight: 600;" />
              <span class="mr-2">{{ image }}</span>
            </b-card-text></b-card>
        </div>
      </div>
    </div>
    <div class="form-group  row">
      <div class="col-12">
        <!-- <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="image-options d-flex flex-wrap justify-content-center">
                <div class="image-option my-3" v-for="(image, index) in imageOptions" :key="index"
                  @click="selectImage(image)">
                  <label>
                    <input type="radio" :value="image" v-model="selectedTheme" style="display: none;" />
                    <span class="mr-2">{{ image }}</span>
                  </label>
                  <img :src="getImagePath(image)" alt="Image" class="img-fluid"
                    :class="{ 'selected-image': selectedTheme === image }" />
                </div>
              </div>
            </div>
          </div>
        </div> -->

        <div class="d-flex justify-content-end mt-3">
          <div class="col-sm-auto">
            <b-button size="sm" variant="primary" class="w-100 mb-2" @click.prevent="confirm()">Submit</b-button>
          </div>
          <div class="col-sm-auto">
            <b-button size="sm" variant="primary" class="w-100 mb-2" @click.prevent="nextForm()">Next</b-button>
          </div>
          <div class="col-sm-auto">
            <b-button size="sm" variant="danger" class="w-100 mb-2" @click.prevent="refreshFormData()">Reset</b-button>
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>
  
<script>
import Swal from "sweetalert2";
export default {
  props: ['formDataList'],
  data() {
    return {
      condition: true,
      selectedTheme: "Default",
      imageOptions: ["Default", "Green", "Dark"],
    };
  },
  created() {
    // Call the updateFormData method with your formDataList
    this.updateFormData(this.formDataList);
  },
  mounted() {
    const data = {
      title: "Themes",
      paragraph: "You can use these fields to design the technical manual's front cover pages..",
      icons: 'mdi mdi-apps font-size-26 align-middle mr-2',

    };
    this.$emit("data-mounted", data);
  },
  beforeDestroy() {
    this.submitForm();
  },
  computed: {
    formattedMessage() {
      return {
        frontmatter_title_commons: this.frontmatter_title,
        topic_title: this.topic_title,
      };
    },
  },
  methods: {
    selectImage(image) {
      this.selectedTheme = image; // Update the selected theme when an image is clicked
    },

    async confirm() {
      if (this.condition) {
        this.submitForm()
        await Swal.fire({
          title: "Are you sure?",
          text: "You want to make final changes.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            this.finalSubmit()
          } else if (result.dismiss === Swal.DismissReason.cancel) {

            console.log("cancle from alert");
          }
        });
      }
    },
    refreshFormData() {
      this.selectedTheme = "Default"
    },
    updateFormData(formDataList) {
      for (const key in formDataList) {
        if (Object.prototype.hasOwnProperty.call(formDataList, key)) {
          this[key] = formDataList[key];
        }
      }
    },
    nextForm() {
      this.$emit('next-form',)
      this.submitForm()
    },
    finalSubmit() {
      this.$emit('final-submit')
    },
    submitForm() {
      const formData = {
        selectedTheme: this.selectedTheme,
      }
      this.$emit('form-submitnew', formData)
    },
    getImagePath(imageName) {
      if (imageName === "Default") {
        return require("../../../../../assets/htmlStyler/layout_default.png");
      } else if (imageName === "Green") {
        return require("../../../../../assets/htmlStyler/layout_1.png");
      } else if (imageName === "Dark") {
        return require("../../../../../assets/htmlStyler/layout_2.png");
      }
    },
  },
};
</script>
  
<style scoped>
/* .image-options {
  width: 60%;

  margin-bottom: 60px;
}

.image-option label {
  margin-bottom: 10px;
}

.img-fluid {
  border: 1px solid rgb(128, 128, 128);
  padding: px;
} */

.selected-image {
  border: 4px solid rgb(153, 177, 255);
  background-color: rgb(153, 177, 255);
  border-radius: 2%;
  text-shadow: 2px;
  color: white;
  /* Add a border to the selected image */
}
.form-group{
    margin: 10px;
}
</style>
  