//Activate REPL with: ts-node
// import api from "./unitTesting";

import { Equal } from "lucide-react";
import {
  defineSharePointSchema,
  ODataFilterAnyOperators,
  ODataFilterBooleanOperators,
  ODataFilterChoiceOperators,
  ODataFilterDateOperators,
  ODataFilterNumericOperators,
  ODataFilterStringOperators,
  ODataQuery,
  ODataSingleFieldFilter,
} from "./src/api/utils/Sharepoint";
import { testRisksDB } from "./src/api/utils/tests/test-sharepoint";

type Expect<T extends true> = T;
type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;
type Not<T> = T extends true ? false : true;
type Extends<A, B> = A extends B ? true : false;

const test_number = [{ internalName: "X", type: "number" }] as const;
type test_number_0 = Expect<
  Equals<ODataSingleFieldFilter<typeof test_number>["field"], "Id" | "X">
>;
type test_number_1 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_number>,
      { field: "X" }
    >["operator"],
    ODataFilterNumericOperators
  >
>;
type test_number_2 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_number>,
      { field: "X" }
    >["value"],
    number
  >
>;

const test_person = [{ internalName: "X", type: "person" }] as const;
type test_person_field = ODataSingleFieldFilter<typeof test_person>["field"];
type test_person_0 = Expect<
  Equals<
    test_person_field,
    | "Id"
    | "X/Id"
    | "X/Title"
    | "X/EMail"
    | "X/Name"
    | "X/FirstName"
    | "X/LastName"
    | "X/JobTitle"
    | "X/Department"
    | "X/MobilePhone"
    | "X/WorkPhone"
  >
  //Shouldn't contain `X` directly
>;
type test_person_1 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_person>,
      { field: "X/Id" }
    >["operator"],
    ODataFilterNumericOperators
  >
>;
type test_person_2 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_person>,
      { field: "X/Id" }
    >["value"],
    number
  >
>;
type test_person_3 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_person>,
      { field: "X/EMail" }
    >["operator"],
    ODataFilterStringOperators
  >
>;
type test_person_4 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_person>,
      { field: "X/EMail" }
    >["value"],
    string
  >
>;
type test_person_5 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_person>,
      { field: "X/Department" }
    >["operator"],
    ODataFilterStringOperators
  >
>;
type test_person_6 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_person>,
      { field: "X/Department" }
    >["value"],
    string
  >
>;

const test_multiperson = defineSharePointSchema([
  { internalName: "X", type: "multiperson" },
] as const);
type test_multiperson_field = ODataSingleFieldFilter<
  typeof test_multiperson
>["field"];
type test_multiperson_0 = Expect<
  Equals<
    ODataSingleFieldFilter<typeof test_multiperson>["field"],
    | "Id"
    | "X/Id"
    | "X/Title"
    | "X/EMail"
    | "X/Name"
    | "X/FirstName"
    | "X/LastName"
    | "X/JobTitle"
    | "X/Department"
    | "X/MobilePhone"
    | "X/WorkPhone"
  >
>;

const test_string = [{ internalName: "X", type: "string" }] as const;
type test_string_0 = Expect<
  Equals<ODataSingleFieldFilter<typeof test_string>["field"], "Id" | "X">
>;
type test_string_1 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_string>,
      { field: "X" }
    >["operator"],
    ODataFilterStringOperators
  >
>;
type test_string_2 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_string>,
      { field: "X" }
    >["value"],
    string
  >
>;

const test_choice_nochoices = [{ internalName: "X", type: "choice" }] as const;
type test_choice_nochoices_0 = Expect<
  Equals<
    ODataSingleFieldFilter<typeof test_choice_nochoices>["field"],
    "Id" | "X"
  >
>;
type test_choice_nochoices_1 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_choice_nochoices>,
      { field: "X" }
    >["operator"],
    ODataFilterChoiceOperators
  >
>;
type test_choice_nochoices_2 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_choice_nochoices>,
      { field: "X" }
    >["value"],
    string
  >
>;

const test_choice_choices = [
  { internalName: "X", type: "choice", choices: ["A", "B", "C"] },
] as const;
type test_choice_choices_0 = Expect<
  Equals<
    ODataSingleFieldFilter<typeof test_choice_choices>["field"],
    "Id" | "X"
  >
>;
type test_choice_choices_1 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_choice_choices>,
      { field: "X" }
    >["operator"],
    ODataFilterChoiceOperators
  >
>;
type test_choice_choices_2 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_choice_choices>,
      { field: "X" }
    >["value"],
    "A" | "B" | "C"
  >
>;

const test_multichoice_nochoices = [
  { internalName: "X", type: "multichoice" },
] as const;
type test_multichoice_nochoices_0 = Expect<
  Equals<
    ODataSingleFieldFilter<typeof test_multichoice_nochoices>["field"],
    "Id" | "X"
  >
>;
type test_multichoice_nochoices_1 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_multichoice_nochoices>,
      { field: "X" }
    >["operator"],
    ODataFilterChoiceOperators
  >
>;
type test_multichoice_nochoices_2 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_multichoice_nochoices>,
      { field: "X" }
    >["value"],
    string
  >
>;

const test_multichoice_choices = [
  { internalName: "X", type: "multichoice", choices: ["A", "B", "C"] },
] as const;
type test_multichoice_choices_0 = Expect<
  Equals<
    ODataSingleFieldFilter<typeof test_multichoice_choices>["field"],
    "Id" | "X"
  >
>;
type test_multichoice_choices_1 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_multichoice_choices>,
      { field: "X" }
    >["operator"],
    ODataFilterChoiceOperators
  >
>;
type test_multichoice_choices_2 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_multichoice_choices>,
      { field: "X" }
    >["value"],
    "A" | "B" | "C"
  >
>;

const test_date = [{ internalName: "X", type: "date" }] as const;
type test_date_0 = Expect<
  Equals<ODataSingleFieldFilter<typeof test_date>["field"], "Id" | "X">
>;
type test_date_1 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_date>,
      { field: "X" }
    >["operator"],
    ODataFilterDateOperators
  >
>;
type test_date_2 = Expect<
  Equals<
    Extract<ODataSingleFieldFilter<typeof test_date>, { field: "X" }>["value"],
    string
  >
>; // ISO date string

const test_boolean = [{ internalName: "X", type: "boolean" }] as const;
type test_boolean_0 = Expect<
  Equals<ODataSingleFieldFilter<typeof test_boolean>["field"], "Id" | "X">
>;
type test_boolean_1 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_boolean>,
      { field: "X" }
    >["operator"],
    ODataFilterBooleanOperators
  >
>;
type test_boolean_2 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_boolean>,
      { field: "X" }
    >["value"],
    boolean
  >
>;

const test_lookup = [{ internalName: "X", type: "lookup" }] as const;
type test_lookup_field = ODataSingleFieldFilter<typeof test_lookup>["field"];
type test_lookup_0 = Expect<
  Equals<
    ODataSingleFieldFilter<typeof test_lookup>["field"],
    "Id" | "X/Id" | "X/Title"
  >
>;

type test_lookup_00 = Expect<Extends<"Id", test_lookup_field>>;
type test_lookup_01 = Expect<Not<Extends<"X", test_lookup_field>>>;
type test_lookup_02 = Expect<Extends<"X/Id", test_lookup_field>>;
type test_lookup_03 = Expect<Extends<"X/Title", test_lookup_field>>;

type test_lookup_1 = Equals<
  Extract<
    ODataSingleFieldFilter<typeof test_lookup>,
    { field: "X/Title" }
  >["operator"],
  ODataFilterStringOperators
>;
type test_lookup_2 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_lookup>,
      { field: "X/Id" }
    >["value"],
    number
  >
>;

const test_lookup_withSelectProps = [
  { internalName: "X", type: "lookup", selectProps: ["Id", "Title", "Status"] },
] as const;
type test_lookup_withSelectProps_field = ODataSingleFieldFilter<
  typeof test_lookup_withSelectProps
>["field"];
type test_lookup_withSelectProps_0 = Expect<
  Equals<
    ODataSingleFieldFilter<typeof test_lookup_withSelectProps>["field"],
    "Id" | "X/Id" | "X/Title" | "X/Status"
  >
>;
type test_lookup_withSelectProps_1 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_lookup_withSelectProps>,
      { field: "X/Status" }
    >["operator"],
    ODataFilterAnyOperators
  >
>;
type _ = Extract<
  ODataSingleFieldFilter<typeof test_lookup_withSelectProps>,
  { field: "X/Status" }
>["operator"];
type test_lookup_withSelectProps_2 = Expect<
  Equals<
    Extract<
      ODataSingleFieldFilter<typeof test_lookup_withSelectProps>,
      { field: "X/Status" }
    >["value"],
    any
  >
>;

const test_select = [
  { internalName: "A", type: "string" },
  { internalName: "B", type: "number" },
  { internalName: "C", type: "boolean" },
  { internalName: "D", type: "date" },
  { internalName: "E", type: "person" },
  { internalName: "F", type: "lookup" },
  { internalName: "G", type: "multichoice" },
  { internalName: "H", type: "choice" },
] as const;
type test_select_field = ODataQuery<typeof test_select>["$select"];
type test_select_0 = Expect<
  Equals<
    ODataQuery<typeof test_select>["$select"],
    | "*"
    | (
        | "A"
        | "B"
        | "C"
        | "D"
        | "G"
        | "H"
        | "Id"
        | "E/Title"
        | "E/Id"
        | "E/EMail"
        | "E/Name"
        | "E/FirstName"
        | "E/LastName"
        | "E/JobTitle"
        | "E/Department"
        | "E/MobilePhone"
        | "E/WorkPhone"
        | "F/Id"
        | "F/Title"
      )[]
  >
>;
type test_select_1 = Expect<
  Equals<ODataQuery<typeof test_select>["$expand"], ("E" | "F")[]>
>;
//Cannot be broken down unfortunately, as "*" | (...)[] makes it impossible to check individual fields. Type widened to string if extraction attempted.

type test_orderby = ODataQuery<typeof test_select>["$orderby"];
type test_orderby_0 = Expect<
  Equals<
    ODataQuery<typeof test_select>["$orderby"],
    {
      name:
        | "A"
        | "B"
        | "C"
        | "D"
        | "G"
        | "H"
        | "Id"
        | "E/Title"
        | "E/Id"
        | "E/EMail"
        | "E/Name"
        | "E/FirstName"
        | "E/LastName"
        | "E/JobTitle"
        | "E/Department"
        | "E/MobilePhone"
        | "E/WorkPhone"
        | "F/Id"
        | "F/Title";
      direction: "asc" | "desc";
    }[]
    //TODO: Again missing F/Id from the type, need to check why. Otherwise all correct.
  >
>;

//Breakdown of the above test_orderby_0 type:
type OrderByFields = ODataQuery<typeof test_select>["$orderby"][number]["name"];
type O1Contains_A = Expect<Extends<"A", OrderByFields>>;
type O1Contains_B = Expect<Extends<"B", OrderByFields>>;
type O1Contains_C = Expect<Extends<"C", OrderByFields>>;
type O1Contains_D = Expect<Extends<"D", OrderByFields>>;
type O1Contains_G = Expect<Extends<"G", OrderByFields>>;
type O1Contains_H = Expect<Extends<"H", OrderByFields>>;
type O1Contains_ID = Expect<Extends<"Id", OrderByFields>>;
type O1Contains_E_Title = Expect<Extends<"E/Title", OrderByFields>>;
type O1Contains_E_Id = Expect<Extends<"E/Id", OrderByFields>>;
type O1Contains_E_EMail = Expect<Extends<"E/EMail", OrderByFields>>;
type O1Contains_E_Name = Expect<Extends<"E/Name", OrderByFields>>;
type O1Contains_E_FirstName = Expect<Extends<"E/FirstName", OrderByFields>>;
type O1Contains_E_LastName = Expect<Extends<"E/LastName", OrderByFields>>;
type O1Contains_E_JobTitle = Expect<Extends<"E/JobTitle", OrderByFields>>;
type O1Contains_E_Department = Expect<Extends<"E/Department", OrderByFields>>;
type O1Contains_E_MobilePhone = Expect<Extends<"E/MobilePhone", OrderByFields>>;
type O1Contains_E_WorkPhone = Expect<Extends<"E/WorkPhone", OrderByFields>>;
type O1Contains_F_Id = Expect<Extends<"F/Id", OrderByFields>>;
type O1Contains_F_Title = Expect<Extends<"F/Title", OrderByFields>>;

/**
 * Test functions for the Risks database.
 * These functions are used to test the functionality of the Risks database.
 * They are not used in production and are only used for testing purposes.
 */
export default {
  /**
   * Get all risks in TORRENT
   * @returns Returns all items in the Risks database.
   */
  test_getItems: async () => {
    return await testRisksDB.getItems();
  },

  /**
   *
   * @returns
   */
  test_getItems_WithFitler: async () => {
    return await testRisksDB.getItems({
      $filter: {
        field: "RiskRaiser/EMail",
        operator: "eq",
        value: "james-pr.warren@severntrent.co.uk",
      },
    });
  },

  test_getItem: async () => {
    return await testRisksDB.getItem(1);
  },
  test_addItem: async () => {
    return await testRisksDB.addItem({
      Description: "That's one crazy risk yo!",
      RiskRaiserEmail: "james-pr.warren@severntrent.co.uk",
      RiskRaisedOn: new Date().toISOString(),
    });
  },
  test_setItem: async () => {
    return await testRisksDB.setItem(1, {
      Description: "That's one crazy risk yo!",
    });
  },

  /**
   * Toggles the RiskRaiser email between two known emails for Richard Charlton and James Warren.
   */
  test_setItem_Raiser: async () => {
    let currentEmail = (await testRisksDB.getItem(1)).RiskRaiser.Email;
    let newEmail =
      currentEmail === "james-pr.warren@severntrent.co.uk"
        ? "richard.charlton@severntrent.co.uk"
        : "james-pr.warren@severntrent.co.uk";
    return await testRisksDB.setItem(1, {
      RiskRaiserEmail: newEmail,
    });
  },

  /**
   * Toggles the NOSStatus between two known values for Risk with ID 2.
   * @returns Sets the NOSStatus of the risk with ID 2 to a specific value.
   */
  test_setItem_NOSStatus: async () => {
    return await testRisksDB.setItem(2, {
      NOSStatus:
        "X. OPS to remediate. Capital investment rejected (Move to 10)",
    });
  },
};
